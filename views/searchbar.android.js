import React from "react-native";

const {
    Image,
    TextInput,
    StyleSheet,
    TouchableNativeFeedback,
    View
} = React;

const styles = StyleSheet.create({
    searchbar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderColor: "rgba(0, 0, 0, .16)",
        borderBottomWidth: 1,
        height: 56
    },
    input: {
        flex: 1,
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
        backgroundColor: "transparent"
    },
    icon: {
        width: 24,
        height: 24,
        marginHorizontal: 22,
        opacity: 0.5
    }
});

export default class SearchBar extends React.Component {
    render() {
        return (
            <View {...this.props} style={[ styles.searchbar, this.props.style ]}>
                <TouchableNativeFeedback
                    onPress={() => this._input && this._input.focus()}>
                    <View>
                        <Image
                          source={require("image!ic_search_black")}
                          style={styles.icon}
                        />
                    </View>
                </TouchableNativeFeedback>
                <TextInput
                    ref={c => this._input = c}
                    autoFocus={this.props.autoFocus}
                    onChange={this.props.onSearchChange}
                    placeholder={this.props.placeholder}
                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                    onFocus={this.props.onFocus}
                    style={styles.input}
                />
            </View>
        );
    }
}

SearchBar.propTypes = {
    onFocus: React.PropTypes.func,
    onSearchChange: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    autoFocus: React.PropTypes.bool
};
