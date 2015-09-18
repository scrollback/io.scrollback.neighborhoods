import React from "react-native";
import Discussion from "./discussion";
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
          <View style={styles.container}>
            <ListView
                style={styles.page}
                dataSource={this.state.dataSource}
                renderRow={thread => <Discussion key={thread.id} thread={thread} navigator={this.props.navigator} />}
            />
          </View>
        );
    }
}
