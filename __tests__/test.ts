import Socket from '../src/index';

test('Socket Test', () => {
    const options = {
        url: 'ws://localhost:8099/ws',
        heartTime: 5000
    };
    expect(new Socket(options));
});