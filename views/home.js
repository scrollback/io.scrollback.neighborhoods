import React from "react-native";
import LocalitiesController from "./localities-controller";

export default class Home extends React.Component {
    render() {
        return <LocalitiesController {...this.props} />;
    }
}
