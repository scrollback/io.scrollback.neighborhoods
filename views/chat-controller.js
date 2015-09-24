import React from "react-native";
import Chat from "./chat";
import socket from "../lib/socket";

const {
    InteractionManager
} = React;

export default class ChatController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            failed: false,
            data: []
        };
    }

    _onDataArrived(newData) {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this.setState({
                    failed: false,
                    data: newData
                });
            }
        });
    }

    _onError() {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this.setState({
                    failed: true
                });
            }
        });
    }

    _onRetry() {

    }

    _onSocketMessage(message) {
        let parsed;

        try {
            parsed = JSON.parse(message);
        } catch (e) {
            // do nothing
        }

        if (parsed && parsed.type === "data") {
            this._onDataArrived(parsed.data.texts);
        }
    }

    componentDidMount() {
        this._mounted = true;
        this._socketMessageHandler = this._onSocketMessage.bind(this);
        this._errorHandler = this._onError.bind(this);

        socket.on("message", this._socketMessageHandler);
        socket.on("error", this._errorHandler);

        socket.send(JSON.stringify({ type: "get" }));
    }

    componentWillUnmount() {
        this._mounted = false;

        socket.off("message", this._socketMessageHandler);
        socket.off("error", this._errorHandler);
    }

    render() {
        return <Chat {...this.props} {...this.state} />;
    }
}
