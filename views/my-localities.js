import React from "react-native";
import RoomItem from "./room-item";
import PageEmpty from "./page-empty";
import PageLoading from "./page-loading";
import PageRetry from "./page-retry";
import Page from "./page";

const {
    ListView,
    View
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
                    if (this.props.data.length === 0) {
                        return <PageEmpty />;
                    }

                    if (this.props.data.length === 1) {
                        if (this.props.data[0] === "LOADING") {
                            return <PageLoading />;
                        }

                        if (this.props.data[0] === "FAILED") {
                            return <PageRetry onRetry={this.props.refreshData} />;
                        }
                    }

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
                })()}
            </View>
        );
    }
}

MyLocalities.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.shape({
        id: React.PropTypes.string.isRequired
    })).isRequired,
    refreshData: React.PropTypes.func,
    navigator: React.PropTypes.object.isRequired
};
