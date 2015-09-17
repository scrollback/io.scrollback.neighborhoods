import React from "react-native";
import Discussion from "./discussion";
import data from "./data";

const {
    StyleSheet,
    ListView
} = React;

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#eee"
    }
});

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            dataSource: ds.cloneWithRows(data.threads)
        };
    }

    render() {
        return (
            <ListView
                style={styles.page}
                dataSource={this.state.dataSource}
                renderRow={thread => <Discussion key={thread.id} thread={thread} />}
            />
        );
    }
}
