import React from "react-native";
import RoomItem from "./room-item";
import PageEmpty from "./page-empty";
import PageLoading from "./page-loading";
import PageRetry from "./page-retry";
import geolocation from "../../modules/geolocation";

const {
    ListView,
    View
} = React;

export default class LocalitiesBase extends React.Component {
    constructor(props) {
        super(props);

        this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

        this.state = {
            position: null
        };
    }

    componentWillMount() {
        geolocation.getCurrentPosition(position => this.setState({ position }));

        this._watchID = geolocation.watchPosition(position => {
            if (this._mounted) {
                this.setState({ position });
            }
        });
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;

        if (this._watchID) {
            geolocation.clearWatch(this._watchID);
        }
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
                            initialListSize={5}
                            dataSource={this._getDataSource()}
                            renderRow={room =>
                                <RoomItem
                                    key={room.id}
                                    room={room}
                                    position={this.state.position}
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

LocalitiesBase.propTypes = {
    data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
        React.PropTypes.oneOf([ "LOADING", "FAILED" ]),
        React.PropTypes.shape({
            id: React.PropTypes.string
        })
    ])).isRequired,
    refreshData: React.PropTypes.func,
    navigator: React.PropTypes.object.isRequired
};
