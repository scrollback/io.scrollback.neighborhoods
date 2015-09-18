import React from "react-native";
import WebSocketBase from "WebSocketBase";
import RCTDeviceEventEmitter from "RCTDeviceEventEmitter";

const {
    NativeModules
} = React;

const {
    WebSocketManager
} = NativeModules;

let WebSocketId = 0;

class WebSocket extends WebSocketBase {
    _socketId: number;
    _subs: any;

    connectToSocketImpl(url: string): void {
        this._socketId = WebSocketId++;

        WebSocketManager.connect(url, this._socketId);

        this._registerEvents(this._socketId);
    }

    closeConnectionImpl(): void {
        WebSocketManager.close(this._socketId);
    }

    cancelConnectionImpl(): void {
        WebSocketManager.close(this._socketId);
    }

    sendStringImpl(message: string): void {
        WebSocketManager.send(message, this._socketId);
    }

    sendArrayBufferImpl(): void {
        console.warn("Sending ArrayBuffers is not yet supported");
    }

    _unregisterEvents(): void {
        this._subs.forEach(e => e.remove());
        this._subs = [];
    }

    _registerEvents(id: number): void {
        this._subs = [
            RCTDeviceEventEmitter.addListener("websocketMessage", ev => {
                if (ev.id !== id) {
                    return;
                }

                if (this.onmessage) {
                    this.onmessage({ data: ev.data });
                }
            }),
            RCTDeviceEventEmitter.addListener("websocketOpen", ev => {
                if (ev.id !== id) {
                    return;
                }

                this.readyState = this.OPEN;

                if (this.onopen) {
                    this.onopen();
                }
            }),
            RCTDeviceEventEmitter.addListener("websocketClosed", ev => {
                if (ev.id !== id) {
                    return;
                }

                this.readyState = this.CLOSED;

                if (this.onclose) {
                    this.onclose(ev);
                }

                this._unregisterEvents();

                WebSocketManager.close(id);
            }),
            RCTDeviceEventEmitter.addListener("websocketFailed", ev => {
                if (ev.id !== id) {
                    return;
                }

                if (this.onerror) {
                    this.onerror(new Error(ev.message));
                }

                this._unregisterEvents();

                WebSocketManager.close(id);
            })
        ];
    }

}

module.exports = WebSocket;
