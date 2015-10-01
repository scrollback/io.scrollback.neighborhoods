import React from "react-native";
import RoomTitle from "./room-title";
import store from "../store/store";

const {
    InteractionManager
} = React;

export default class RoomTitleController extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            room: { displayName: this.props.room }
        };
    }

    componentDidMount() {
        this._mounted = true;

        setTimeout(() => this._onDataArrived(store.getRoomById(this.props.room)), 0);
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    _onDataArrived(room) {
        InteractionManager.runAfterInteractions(() => {
            if (this._mounted) {
                this.setState({ room });
            }
        });
    }

    render() {
        return <RoomTitle {...this.state} />;
    }
}

RoomTitleController.propTypes = {
    room: React.PropTypes.string.isRequired
};
