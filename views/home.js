import React from "react-native";
import Discussion from "./discussion";
import Loading from "./loading";
import socket from "../lib/socket";

const {
    StyleSheet,
    ListView,
    View,
    InteractionManager
} = React;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eee"
    },
    toolbar: {
        backgroundColor: "#673AB7",
        height: 56
    },
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    loading: {
        height: 36,
        width: 36
    }
});

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
        this._data = this._data.concat(newData);

        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(this._data)
        });
    }

    componentDidMount() {
        socket.on("data", data => {
            InteractionManager.runAfterInteractions(() => {
                this._onDataArrived(data.threads);
            });
        });

        socket.emit("get");
    }

    render() {
        return (
            <View style={styles.container}>
                {this._data.length ?
                    <ListView
                        dataSource={this.state.dataSource}
                        renderRow={thread => <Discussion key={thread.id} thread={thread} navigator={this.props.navigator} />}
                    /> :
                    <View style={styles.loadingContainer}>
                        <Loading style={styles.loading} />
                    </View>
                }
            </View>
        );
    }
}
