"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var heart_1 = require("./heart");
// option默认值
var DEFAULT_OPTION = {
    url: '',
    heartTime: 5000,
    reconnectTime: 5000,
    reconnectCount: 5
};
var Socket = /** @class */ (function (_super) {
    __extends(Socket, _super);
    function Socket(options) {
        var _this = _super.call(this, options.heartTime) || this;
        _this.reconnectTimer = null; // 重连定时器
        _this.RECONNECT_COUNT = 10;
        _this.isRestory = false; // 是否销毁
        _this.heartStatus = 'ping';
        _this.ws = null;
        _this.options = DEFAULT_OPTION;
        Object.assign(_this.options, options);
        _this.onconnect();
        return _this;
    }
    /**
     * @desription socket开始连接事件
     */
    Socket.prototype.onconnect = function () {
        if (!('WebSocket' in window)) {
            new Error('当前浏览器不支持websocket， 请使用chrome浏览器');
            return;
        }
        if (!this.options.url) {
            new Error('地址不存在，无法建立通道');
            return;
        }
        this.ws = new WebSocket(this.options.url);
        this.onopen();
        this.onclose();
        this.onmessage();
    };
    /**
     * @desription 监听连接事件
     */
    Socket.prototype.onopen = function () {
        var _this = this;
        if (!this.ws)
            return;
        this.ws.onopen = function (event) {
            console.log('websocket已连接');
            clearTimeout(_this.reconnectTimer); // 清除重连定时器
            _this.options = __assign(__assign({}, _this.options), { reconnectCount: _this.RECONNECT_COUNT // 计数器重置
             });
            // 建立心跳机制
            _super.prototype.reset.call(_this).start(function () {
                _this.send(_this.heartStatus);
            });
            if (typeof _this.options.openCallback === 'function') {
                _this.options.openCallback(event);
            }
        };
    };
    /**
     * @desription 收到服务端发来的消息
     */
    Socket.prototype.onmessage = function () {
        var _this = this;
        if (!this.ws)
            return;
        this.ws.onmessage = function (event) {
            // 方式一：收到任何消息，重新开始倒计时心跳检测，方式二：与后端约束参数，不用每次都重置心跳
            _super.prototype.reset.call(_this).start(function () {
                _this.send(_this.heartStatus);
            });
            if (typeof _this.options.messageCallback === 'function') {
                _this.options.messageCallback(event.data);
            }
        };
    };
    /**
     * @desription 发送信息给服务端
     */
    Socket.prototype.send = function (data) {
        if (!this.ws)
            return;
        if (this.ws.readyState !== this.ws.OPEN) {
            new Error('没有连接到服务器，无法推送');
            return;
        }
        this.ws.send(data);
    };
    /**
     * @desription 重连操作
     */
    Socket.prototype.onreconnect = function () {
        var _this = this;
        if (this.options.reconnectCount && (this.options.reconnectCount > 0 || this.options.reconnectCount === -1)) {
            this.reconnectTimer = setTimeout(function () {
                console.log('websocket重连');
                _this.onconnect();
                if (_this.options.reconnectCount && _this.options.reconnectCount !== -1)
                    _this.options.reconnectCount--;
            }, this.options.reconnectTime);
        }
        else {
            clearTimeout(this.reconnectTimer);
            this.options = __assign(__assign({}, this.options), { reconnectCount: this.RECONNECT_COUNT });
        }
    };
    /**
     * @desription socket关闭处理，非正常情况断开，会自动重连
     */
    Socket.prototype.onclose = function () {
        var _this = this;
        if (!this.ws)
            return;
        this.ws.onclose = function (event) {
            _super.prototype.reset.call(_this);
            // 未销毁，即非正常情况断开，需要重连
            if (!_this.isRestory) {
                _this.onreconnect();
            }
            if (typeof _this.options.closeCallback === 'function') {
                _this.options.closeCallback(event);
            }
        };
    };
    /**
     * @desription 发生错误
     */
    Socket.prototype.onerror = function () {
        var _this = this;
        if (!this.ws)
            return;
        this.ws.onerror = function (event) {
            if (typeof _this.options.errorCallback === 'function') {
                _this.options.errorCallback(event);
            }
        };
    };
    /**
     * @desription 销毁socket实例
     */
    Socket.prototype.destroy = function () {
        var _a;
        _super.prototype.reset.call(this);
        clearTimeout(this.reconnectTimer); // 清除重连定时器
        this.isRestory = true;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
    };
    return Socket;
}(heart_1.default));
exports.default = Socket;
