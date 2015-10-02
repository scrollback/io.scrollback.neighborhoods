import React from "react-native";
import Localities from "./localities";
import locationUtils from "../../lib/location-utils";
import store from "../../store/store";

const {
    InteractionManager
} = React;

const currentLocation = {
    latitude: 12.9667,
    longitude: 77.5667
};

export default class LocalitiesController extends React.Component {
    constructor(props) {
        super(props);

        this._data = [ "LOADING" ];

        this.state = {
            data: this._data
        };
    }

    componentDidMount() {
        this._mounted = true;

        setTimeout(() => this._onDataArrived(store.getRelatedRooms()), 0);
    }

    componentWillReceiveProps(nextProps) {
        this._setFilteredData(this._data, nextProps.filter);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    _setFilteredData(data, filter) {
        const filteredData = filter ? data.filter(room => {
            return (
                room.id.toLowerCase().indexOf(filter) > -1 ||
                room.displayName.toLowerCase().indexOf(filter) > -1
            );
        }) : data;

        filteredData.sort((a, b) => locationUtils.compareAreas(currentLocation, a, b));

        this.setState({
            data: filteredData
        });
    }

    _onDataArrived(newData) {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this._data = newData;

                this._setFilteredData(newData, this.props.filter);
            }
        });
    }

    _onError() {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this.setState({
                    data: [ "FAILED" ]
                });
            }
        });
    }

    _refreshData() {

    }

    render() {
        return (
            <Localities
                {...this.props}
                {...this.state}
                refreshData={this._refreshData.bind(this)}
            />
        );
    }
}

LocalitiesController.propTypes = {
    filter: React.PropTypes.string
};
