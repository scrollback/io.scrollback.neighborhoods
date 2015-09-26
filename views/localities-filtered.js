import React from "react-native";
import SearchBar from "./searchbar";
import LocalitiesController from "./localities-controller";

const {
    StyleSheet,
    View
} = React;

const styles = StyleSheet.create({
    scene: { flex: 1 }
});

export default class LocalitiesFiltered extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fliter: ""
        };
    }

    _onSearchChange(filter) {
        this.setState({ filter });
    }

    render() {
        return (
            <View {...this.props}>
                <SearchBar
                    autoFocus={false}
                    onSearchChange={this._onSearchChange.bind(this)}
                    placeholder="Search for places..."
                />
                <LocalitiesController
                    filter={this.state.filter}
                    style={styles.scene}
                    navigator={this.props.navigator}
                />
            </View>
        );
    }
}

LocalitiesFiltered.propTypes = {
    filter: React.PropTypes.func,
    navigator: React.PropTypes.object.isRequired
};
