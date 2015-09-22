import React from "react-native";
import Discussion from "./discussion";
import PageLoading from "./page-loading";
import socket from "../lib/socket";

const {
    ListView,
    View,
    InteractionManager
} = React;

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this._data = [];

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows(this._data)
        };
    }

    _onDataArrived(newData) {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this._data = this._data.concat(newData);

                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this._data)
                });
            }
        });
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

        socket.on("message", this._socketMessageHandler);

        socket.send(JSON.stringify({ type: "get" }));
    }

    componentWillUnmount() {
        this._mounted = false;

        socket.off("message", this._socketMessageHandler);
    }

    render() {
        return (
            <View {...this.props}>
                {this._data.length ?
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={thread => <Discussion key={thread.id} thread={thread} navigator={this.props.navigator} />}
                    /> :
                    <PageLoading />
                }
            </View>
        );
    }
}
