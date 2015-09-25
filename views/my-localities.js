import React from "react-native";
import RoomItem from "./room-item";
import PageLoading from "./page-loading";
import PageRetry from "./page-retry";
import Page from "./page";

const {
    ListView,
    View,
    Text
} = React;

export default class MyLocalities extends React.Component {
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
                                renderRow={room =>
                                    <RoomItem
                                        key={room.id}
                                        room={room}
                                        navigator={this.props.navigator}
                                    />
                                }
                            />
                        );
                    } else if (this.props.failed) {
                        return <PageRetry onRetry={this.props.onRetry} />;
                    } else {
                        if (this.props.filter) {
                            return (
                                <Page>
                                    <Text>No results found.</Text>
                                </Page>
                            );
                        }

                        return <PageLoading />;
                    }
                })()}
            </View>
        );
    }
}

MyLocalities.propTypes = {
    filter: React.PropTypes.string,
    failed: React.PropTypes.bool,
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired
    })).isRequired,
    onRetry: React.PropTypes.func,
    navigator: React.PropTypes.object.isRequired
};
