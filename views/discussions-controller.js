import React from "react-native";
import Discussions from "./discussions";
import socket from "../lib/socket";

const {
    InteractionManager
} = React;

export default class DiscussionsController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            failed: false,
            data: []
        };
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
            this._onDataArrived(parsed.data.threads);
        }
    }

    render() {
        return (
            <Discussions
                {...this.props}
                {...this.state}
                onRetry={this._onRetry.bind(this)}
            />
        );
    }
}
