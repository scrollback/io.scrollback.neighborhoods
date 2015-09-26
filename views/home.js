import React from "react-native";
import LocalitiesFiltered from "./localities-filtered";

export default class Home extends React.Component {
    render() {
        return <LocalitiesFiltered {...this.props} />;
    }
}
