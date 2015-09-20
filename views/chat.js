import React from "react-native";
import ChatItem from "./chat-item";
import Loading from "./loading";
import data from "../data";

const {
    StyleSheet,
    ListView,
    View
} = React;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    toolbar: {
        backgroundColor: "#673AB7",
        height: 56
    },
    page: {
        backgroundColor: "#eee"
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
        setTimeout(() => this._onDataArrived(data.texts), 3000);
    }

    render() {
        let { dataSource } = this.state;

        return (
          <View style={styles.container}>
            {this._data.length ?
                <ListView
                    style={styles.page}
                    dataSource={dataSource}
                    renderRow={(text, sectionID, rowID) => {
                        let previousText;

                        if (rowID > 0) {
                            previousText = dataSource.getRowData(0, rowID - 1);
                        }

                        return <ChatItem key={text.id} text={text} previousText={previousText} />;
                    }}
                /> :
                <View style={styles.loadingContainer}>
                    <Loading style={styles.loading} />
                </View>
            }
          </View>
        );
    }
}
