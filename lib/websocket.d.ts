import Heart from './heart';
/**
 * @descrition socket 外部传入可用参数
 */
declare type SocketOption = {
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
};
export default class Socket extends Heart {
    private reconnectTimer;
    private readonly RECONNECT_COUNT;
    private isRestory;
    private heartStatus;
    private ws;
    private options;
    constructor(options: SocketOption);
    /**
     * @desription socket开始连接事件
     */
    onconnect(): void;
    /**
     * @desription 监听连接事件
     */
    onopen(): void;
    /**
     * @desription 收到服务端发来的消息
     */
    onmessage(): void;
    /**
     * @desription 发送信息给服务端
     */
    send(data: any): void;
    /**
     * @desription 重连操作
     */
    onreconnect(): void;
    /**
     * @desription socket关闭处理，非正常情况断开，会自动重连
     */
    onclose(): void;
    /**
     * @desription 发生错误
     */
    onerror(): void;
    /**
     * @desription 销毁socket实例
     */
    destroy(): void;
}
export {};
