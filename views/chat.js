import React from "react-native";
import ChatItem from "./chat-item";
import data from "./data";

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
    }
});

export default class Chat extends React.Component {
    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows(data.texts)
        };
    }

    render() {
        return (
          <View style={styles.container}>
            <ListView
                style={styles.page}
                dataSource={this.state.dataSource}
                renderRow={text => <ChatItem key={text.id} text={text} />}
            />
          </View>
        );
    }
}
