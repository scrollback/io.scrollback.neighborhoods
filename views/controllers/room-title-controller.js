import React from "react-native";
import RoomTitle from "../components/room-title";
import store from "../../store/store";

const {
    InteractionManager
} = React;

export default class RoomTitleController extends React.Component {
    constructor(props) {
        super(props);

        const displayName = this.props.room.replace(/-+/g, " ").replace(/\w\S*/g, s => s.charAt(0).toUpperCase() + s.slice(1)).trim();

        this.state = {
            room: { displayName }
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
