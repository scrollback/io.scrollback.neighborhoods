import React from "react-native";
import MyLocalities from "./my-localities";

export default class Home extends React.Component {
    render() {
        return <MyLocalities {...this.props} />;
    }
}
