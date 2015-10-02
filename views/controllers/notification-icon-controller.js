import React from "react-native";
import NotificationIcon from "../components/notification-icon";
import store from "../../store/store";

export default class NotificationIconController extends React.Component {
    constructor(props) {
        super(props);

        this.state = { count: store.getNotes().length };
    }

    render() {
        return <NotificationIcon {...this.props} {...this.state} />;
    }
}
