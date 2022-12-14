# socketjs-client
websocket / typescript

## Installation

`npm i -D socketjs-client`

## Basic Usage

```ts

// 基础使用
import Socket from 'socketjs-client';

const options = {
    url: 'ws://localhost:8099/ws', // 必填，链接的通道的地址
    heartTime: 5000, // 必填，心跳时间间隔（毫秒）
    reconnectTime: 5000, // 非必填，默认5000，重连时间间隔（毫秒）
    reconnectCount: 5 // 非必填，默认5，重连次数，-1则不限制
};
new Socket(options);

// 销毁
const socket = new Socket(options);
socket.destroy();

// 自定义回调(可额外处理业务上其他逻辑)
const options = {
    url: 'ws://localhost:8099/ws',
    heartTime: 5000,
    openCallback: () => {}, // 连接成功的回调
    closeCallback: () => {}, // 连接关闭的回调
    messageCallback: () => {}, // 收到消息的回调
    errorCallback: () => {}, // 发生错误的回调
};
new Socket(options);

```

[传送门：Koa封装](https://github.com/costaq/socketjs-koa)