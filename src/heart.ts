export default class Heart {
    timeout: number = 0;
    heartTimer: any = null // 心跳计时器

    constructor(timeout: number) {
        this.timeout = timeout;
    }
    /**
     * @description 重置心跳
     */
    reset() {
        clearTimeout(this.heartTimer)
        return this
    }
    /**
     * @description 启动心跳
     */
    start(cb: Function) {
        this.heartTimer = setInterval(() => {
            cb()
        }, this.timeout)
    }
}