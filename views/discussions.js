import React from "react-native";
import DiscussionItem from "./discussion-item";
import PageLoading from "./page-loading";
import PageRetry from "./page-retry";
import socket from "../lib/socket";

const {
    ListView,
    View,
    InteractionManager
} = React;

export default class Discussions extends React.Component {
    constructor(props) {
        super(props);

        this._data = [];

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            failed: false,
            dataSource: ds.cloneWithRows(this._data)
        };
    }

    _onDataArrived(newData) {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this._data = this._data.concat(newData);

                this.setState({
                    failed: false,
                    dataSource: this.state.dataSource.cloneWithRows(this._data)
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
        return (
            <View {...this.props}>
                {(() => {
                    if (this._data.length) {
                        return (
                            <ListView
                                dataSource={this.state.dataSource}
                                renderRow={thread => <DiscussionItem key={thread.id} thread={thread} navigator={this.props.navigator} />}
                            />
                        );
                    } else if (this.state.failed) {
                        return <PageRetry onRetry={this._onRetry.bind(this)} />;
                    } else {
                        return <PageLoading />;
                    }
                })()}
            </View>
        );
    }
}
