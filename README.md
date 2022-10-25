# socketjs-client
websocket / typescript

## Installation

`npm i -D socketjs-client`

## Usage

```ts
import Socket from 'socketjs-client';

const options = {
    url: 'ws://localhost:8099/ws',
    heartTime: 5000
};
new Socket(options);