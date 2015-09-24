import React from "react-native";
import DiscussionItem from "./discussion-item";
import PageLoading from "./page-loading";
import PageRetry from "./page-retry";

const {
    ListView,
    View
} = React;

export default class Discussions extends React.Component {
    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            failed: false,
            dataSource: ds.cloneWithRows(this.props.data)
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(nextProps.data)
        });
    }

    render() {
        return (
            <View {...this.props}>
                {(() => {
                    if (this.props.data.length) {
                        return (
                            <ListView
                                dataSource={this.state.dataSource}
                                renderRow={thread => <DiscussionItem key={thread.id} thread={thread} navigator={this.props.navigator} />}
                            />
                        );
                    } else if (this.props.failed) {
                        return <PageRetry onRetry={this._onRetry.bind(this)} />;
                    } else {
                        return <PageLoading />;
                    }
                })()}
            </View>
        );
    }
}

Discussions.propTypes = {
    failed: React.PropTypes.bool,
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired
    })).isRequired
};
