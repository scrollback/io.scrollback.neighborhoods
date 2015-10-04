import React from "react-native";
import LocalitiesFiltered from "../components/localities-filtered";
import store from "../../store/store";

const {
    InteractionManager
} = React;

export default class LocalitiesFilterController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    _onDataArrived(data) {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this.setState({ data });
            }
        });
    }

    _onSearchChange(filter) {
        this._onDataArrived(store.getAllRooms().filter(room => {
            return (
                room.id.toLowerCase().indexOf(filter) === 0 ||
                room.displayName.toLowerCase().indexOf(filter) === 0
            );
        }).slice(0, 10));
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

    render() {
        return (
            <LocalitiesFiltered
                {...this.props}
                {...this.state}
                onSearchChange={this._onSearchChange.bind(this)}
            />
        );
    }
}

LocalitiesFilterController.propTypes = {
    filter: React.PropTypes.string
};
