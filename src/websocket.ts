import Heart from './heart';

/**
 * @descrition socket 外部传入可用参数
 */
type SocketOption = {
    /**
     * @descrition 链接的通道的地址
     */
    url: string;
    /**
     * @descrition 心跳时间间隔
     */
    heartTime: number;
    /**
     * @descrition 重连时间间隔
     */
    reconnectTime?: number;
    /**
     * @descrition 重连次数 -1 则不限制
     */
    reconnectCount?: number;
    /**
     * @descrition 连接成功的回调
     */
    openCallback?: Function;
    /**
     * @descrition 连接关闭的回调
     */
    closeCallback?: Function;
    /**
     * @descrition 收到消息的回调
     */
    messageCallback?: Function;
    /**
     * @descrition 发生错误的回调
     */
    errorCallback?: Function;
}

// option默认值
const DEFAULT_OPTION: SocketOption = {
    url: '',
    heartTime: 5000,
    reconnectTime: 5000,
    reconnectCount: 5
}

export default class Socket extends Heart {
    private reconnectTimer: any = null; // 重连定时器
    private readonly RECONNECT_COUNT: number = 10;
    private isRestory: boolean = false; // 是否销毁
    private heartStatus: 'ping' | 'pong' = 'ping';
    private ws: WebSocket | null = null;
    private options: SocketOption = DEFAULT_OPTION;

    constructor(options: SocketOption) {
        super(options.heartTime);
        (<any>Object).assign(this.options, options);
        this.onconnect();
    }
    /**
     * @desription socket开始连接事件
     */
    onconnect() {
        if (!('WebSocket' in window)) {
            new Error('当前浏览器不支持websocket， 请使用chrome浏览器')
            return
        }
        if (!this.options.url) {
            new Error('地址不存在，无法建立通道')
            return
        }
        this.ws = new WebSocket(this.options.url);
        this.onopen()
        this.onclose()
        this.onmessage()
    }
    /**
     * @desription 监听连接事件
     */
    onopen() {
        if (!this.ws) return;
        this.ws.onopen = (event) => {
            console.log('websocket已连接');
            clearTimeout(this.reconnectTimer) // 清除重连定时器
            this.options = {
                ...this.options,
                reconnectCount: this.RECONNECT_COUNT // 计数器重置
            }
            // 建立心跳机制
            super.reset().start(() => {
                this.send(this.heartStatus)
            })
            if(typeof this.options.openCallback === 'function') {
                this.options.openCallback(event);
            }
        }
    }
    /**
     * @desription 收到服务端发来的消息
     */
    onmessage() {
        if (!this.ws) return;
        this.ws.onmessage = (event) => {
            // 方式一：收到任何消息，重新开始倒计时心跳检测，方式二：与后端约束参数，不用每次都重置心跳
            super.reset().start(() => {
                this.send(this.heartStatus)
            })
            if(typeof this.options.messageCallback === 'function') {
                this.options.messageCallback(event.data);
            }
        }
    }
    /**
     * @desription 发送信息给服务端
     */
    send(data: any) {
        if (!this.ws) return;
        if (this.ws.readyState !== this.ws.OPEN) {
            new Error('没有连接到服务器，无法推送')
            return
        }
        this.ws.send(data);
    }
    /**
     * @desription 重连操作
     */
    onreconnect() {
        if (this.options.reconnectCount && (this.options.reconnectCount > 0 || this.options.reconnectCount === -1)) {
            this.reconnectTimer = setTimeout(() => {
                console.log('websocket重连');
                this.onconnect()
                if (this.options.reconnectCount && this.options.reconnectCount !== -1) this.options.reconnectCount--
            }, this.options.reconnectTime);
        } else {
            clearTimeout(this.reconnectTimer);
            this.options = {
                ...this.options,
                reconnectCount: this.RECONNECT_COUNT
            }
        }
    }
    /**
     * @desription socket关闭处理，非正常情况断开，会自动重连
     */
    onclose() {
        if (!this.ws) return;
        this.ws.onclose = (event) => {
            super.reset();
            // 未销毁，即非正常情况断开，需要重连
            if (!this.isRestory) {
                this.onreconnect();
            }
            if(typeof this.options.closeCallback === 'function') {
                this.options.closeCallback(event);
            }
        }
    }
    /**
     * @desription 发生错误
     */
    onerror() {
        if (!this.ws) return;
        this.ws.onerror = (event) => {
            if(typeof this.options.errorCallback === 'function') {
                this.options.errorCallback(event);
            }
        }
    }
    /**
     * @desription 销毁socket实例
     */
    destroy() {
        super.reset();
        clearTimeout(this.reconnectTimer); // 清除重连定时器
        this.isRestory = true;
        this.ws?.close();
    }
}