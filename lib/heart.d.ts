export default class Heart {
    timeout: number;
    heartTimer: any;
    constructor(timeout: number);
    /**
     * @description 重置心跳
     */
    reset(): this;
    /**
     * @description 启动心跳
     */
    start(cb: Function): void;
}
