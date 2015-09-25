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

        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    }

    _getDataSource() {
        return this.dataSource.cloneWithRows(this.props.data);
    }

    render() {
        return (
            <View {...this.props}>
                {(() => {
                    if (this.props.data.length) {
                        return (
                            <ListView
                                dataSource={this._getDataSource()}
                                renderRow={thread =>
                                    <DiscussionItem
                                        key={thread.id}
                                        thread={thread}
                                        navigator={this.props.navigator}
                                    />
                                }
                            />
                        );
                    } else if (this.props.failed) {
                        return <PageRetry onRetry={this.props.onRetry} />;
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
    })).isRequired,
    onRetry: React.PropTypes.func,
    navigator: React.PropTypes.object.isRequired
};
