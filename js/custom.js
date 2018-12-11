var BaseN = {
    b64: {
        list: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
        chars: 4, bits: 6,
        regex: /^[A-Za-z0-9\-_]{22}$/,
        toBin: function (b64) {
            b64 = b64.replace(/\+/g, "-").replace(/\//g, "_");
            b64 = b64.match(BaseN.b64.regex) !== null ? b64 : "";
            return BaseN.toBin(b64, BaseN.b64);
        },
        prettify: function (b64) {
            return b64.replace(/==/g, "");
        }
    },
    b16: {
        list: "0123456789abcdef",
        chars: 2, bits: 4,
        regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        toBin: function (b16) {
            b16 = b16.toLowerCase();
            b16 = b16.match(BaseN.b16.regex) !== null ? b16 : "";
            b16 = b16.replace(/-/g, "");
            return BaseN.toBin(b16, BaseN.b16);
        },
        prettify: function (b16) {
            if(b16.length !== 32){
                return;
            }
            return [b16.slice(0, 8), b16.slice(8, 12), b16.slice(12, 16), b16.slice(16, 20), b16.slice(20, 32)]
                .join("-");
        }
    },
    toBin: function (code, n) {
        var bin = "";
        for (var i = 0; i < code.length; i++) {
            var tmp = n.list.indexOf(code[i]).toString(2);
            bin += ("00000" + tmp).slice(-n.bits);
        }

        return bin.slice(0, bin.length - bin.length % 8);
    },
    toBaseN: function (code, fromN, toN) {
        var binary = fromN.toBin(code);
        var groupBits = toN.chars * toN.bits;
        var arr = binary.match(new RegExp(".{1," + groupBits + "}", "g")) || [];
        var baseN = "";
        var chr = toN.chars;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].length !== groupBits) {
                if (arr[i].length % toN.bits !== 0) {
                    arr[i] += Array(toN.bits - arr[i].length % toN.bits).fill("0").join("");
                }
                chr = arr[i].length / toN.bits;
            }
            for (var j = 0; j < chr; j++) {
                baseN += toN.list[parseInt(arr[i].slice(toN.bits * j, toN.bits * (j + 1)), 2)];
            }
        }
        baseN += Array(toN.chars - chr).fill("=").join("");
        baseN = toN.prettify(baseN);
        return baseN;
    }
};

var app = new Vue({
    el: "#app",
    data: {
        b16: {title: "Base16", value: ""},
        b64: {title: "Base64", value: ""}
    },
    methods: {
        updateB16: function () {
            this.b16.value = BaseN.toBaseN(this.b64.value, BaseN.b64, BaseN.b16);
        },
        updateB64: function () {
            this.b64.value = BaseN.toBaseN(this.b16.value, BaseN.b16, BaseN.b64);
        }
    }
});

app.b16.value = "cafecafe-cafe-cafe-cafe-cafecafecafe";
app.updateB64();