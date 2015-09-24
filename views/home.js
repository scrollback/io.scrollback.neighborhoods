import React from "react-native";
import FilteredLocalities from "./filtered-localities";

export default class Home extends React.Component {
    render() {
        return <FilteredLocalities {...this.props} />;
    }
}
