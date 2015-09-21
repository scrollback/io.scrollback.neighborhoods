import React from "react-native";
import ChatItem from "./chat-item";
import PageLoading from "./page-loading";
import socket from "../lib/socket";

const {
    ListView,
    View,
    InteractionManager
} = React;

export default class Chat extends React.Component {
    constructor(props) {
        super(props);

        this._data = [];

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows(this._data)
        };
    }

    _onDataArrived(newData) {
        this._data = this._data.concat(newData);

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this._data)
        });
    }

    componentDidMount() {
        socket.on("data", data => {
            InteractionManager.runAfterInteractions(() => this._onDataArrived(data.texts));
        });

        socket.emit("get");
    }

    render() {
        let { dataSource } = this.state;

        return (
            <View {...this.props}>
                {this._data.length ?
                    <ListView
                        dataSource={dataSource}
                        renderRow={(text, sectionID, rowID) => {
                            let previousText;

                            if (rowID > 0) {
                                previousText = dataSource.getRowData(0, rowID - 1);
                            }

                            return <ChatItem key={text.id} text={text} previousText={previousText} />;
                        }}
                    /> :
                    <PageLoading />
                }
            </View>
        );
    }
}
