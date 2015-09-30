import React from "react-native";
import NotificationIcon from "./notification-icon";

export default class NotificationIconController extends React.Component {
    constructor(props) {
        super(props);

        this.state = { count: Math.round(Math.random() * 200) };
    }

    render() {
        return <NotificationIcon {...this.props} {...this.state} />;
    }
}
