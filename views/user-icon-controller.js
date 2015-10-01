import React from "react-native";
import UserIcon from "./user-icon";
import store from "../store/store";

export default class UserIconController extends React.Component {
    render() {
        const user = store.getUser();

        return <UserIcon nick={user.id} />;
    }
}
