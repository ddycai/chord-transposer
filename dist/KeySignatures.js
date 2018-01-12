"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var ts_enums_1 = require("ts-enums");
var KeyType;
(function (KeyType) {
    KeyType[KeyType["FLAT"] = 0] = "FLAT";
    KeyType[KeyType["SHARP"] = 1] = "SHARP";
})(KeyType = exports.KeyType || (exports.KeyType = {}));
var KeySignature = /** @class */ (function (_super) {
    __extends(KeySignature, _super);
    function KeySignature(majorKey, relativeMinor, keyType, rank) {
        var _this = _super.call(this, majorKey) || this;
        _this.majorKey = majorKey;
        _this.relativeMinor = relativeMinor;
        _this.keyType = keyType;
        _this.rank = rank;
        return _this;
    }
    return KeySignature;
}(ts_enums_1.EnumValue));
exports.KeySignature = KeySignature;
/** Enum for each key signature. */
var KeySignatureEnum = /** @class */ (function (_super) {
    __extends(KeySignatureEnum, _super);
    function KeySignatureEnum() {
        var _this = _super.call(this) || this;
        _this.C = new KeySignature('C', 'Am', KeyType.SHARP, 0);
        _this.Db = new KeySignature('Db', 'Bbm', KeyType.FLAT, 1);
        _this.D = new KeySignature('D', 'Bm', KeyType.SHARP, 2);
        _this.Eb = new KeySignature('Eb', 'Cm', KeyType.FLAT, 3);
        _this.E = new KeySignature('E', 'C#m', KeyType.SHARP, 4);
        _this.F = new KeySignature('F', 'Dm', KeyType.FLAT, 5);
        _this.Gb = new KeySignature('Gb', 'Ebm', KeyType.FLAT, 6);
        _this.Fsharp = new KeySignature('F#', 'D#m', KeyType.SHARP, 6);
        _this.G = new KeySignature('G', 'Em', KeyType.SHARP, 7);
        _this.Ab = new KeySignature('Ab', 'Fm', KeyType.FLAT, 8);
        _this.A = new KeySignature('A', 'F#m', KeyType.SHARP, 9);
        _this.Bb = new KeySignature('Bb', 'Gm', KeyType.FLAT, 10);
        _this.B = new KeySignature('B', 'G#m', KeyType.SHARP, 11);
        _this.initEnum('KeySignature');
        return _this;
    }
    /** Returns the enum constant with the specific name. */
    KeySignatureEnum.prototype.valueOf = function (name) {
        for (var _i = 0, _a = this.values; _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.majorKey === name || key.relativeMinor === name) {
                return key;
            }
        }
        throw new Error(name + " is not a valid key signature.");
    };
    KeySignatureEnum.prototype.forRank = function (rank) {
        for (var _i = 0, _a = this.values; _i < _a.length; _i++) {
            var key = _a[_i];
            if (key.rank === rank) {
                return key;
            }
        }
        throw new Error(rank + " is not a valid rank.");
    };
    return KeySignatureEnum;
}(ts_enums_1.Enum));
exports.KeySignatures = new KeySignatureEnum();
