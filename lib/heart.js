"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Heart = /** @class */ (function () {
    function Heart(timeout) {
        this.timeout = 0;
        this.heartTimer = null; // 心跳计时器
        this.timeout = timeout;
    }
    /**
     * @description 重置心跳
     */
    Heart.prototype.reset = function () {
        clearTimeout(this.heartTimer);
        return this;
    };
    /**
     * @description 启动心跳
     */
    Heart.prototype.start = function (cb) {
        this.heartTimer = setInterval(function () {
            cb();
        }, this.timeout);
    };
    return Heart;
}());
exports.default = Heart;
