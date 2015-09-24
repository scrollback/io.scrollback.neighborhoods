import React from "react-native";
import SearchBar from "./searchbar";
import MyLocalities from "./my-localities";

const {
    StyleSheet,
    View
} = React;

const styles = StyleSheet.create({
    scene: { flex: 1 }
});

export default class FilteredLocalities extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            fliter: ""
        };
    }

    _onSearchChange(e) {
        const filter = e.nativeEvent.text.toLowerCase();

        this.setState({ filter });
    }

    render() {
        return (
            <View {...this.props}>
                <SearchBar
                    autoFocus={false}
                    onChange={this._onSearchChange.bind(this)}
                    placeholder="Search for places..."
                />
                <MyLocalities filter={this.state.filter} style={styles.scene} navigator={this.props.navigator} />
            </View>
        );
    }
}

FilteredLocalities.propTypes = {
    filter: React.PropTypes.func
};
