import React from "react-native";
import TouchFeedback from "./touch-feedback";

const {
    StyleSheet,
    Image,
    TextInput,
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
    iconContainer: {
        paddingHorizontal: 22,
        alignSelf: "stretch",
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        width: 24,
        height: 24,
        opacity: 0.5
    }
});

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputText: "",
            showClear: false
        };
    }

    _onChange(e) {
        const text = e.nativeEvent.text;

        if (text) {
            if (!this.state.showClear) {
                this.setState({
                    showClear: true
                });
            }
        } else {
            if (this.state.showClear) {
                this.setState({
                    showClear: false
                });
            }
        }

        this.props.onSearchChange(text);
    }

    _clearInput() {
        if (this._input) {
            this._input.setNativeProps({ text: "" });
        }

        this.setState({
            showClear: false
        });

        this.props.onSearchChange("");
    }

    render() {
        return (
            <View {...this.props} style={[ styles.searchbar, this.props.style ]}>
                <TouchFeedback onPress={() => this._input && this._input.focus()}>
                    <View style={styles.iconContainer}>
                        <Image
                            source={require("image!ic_search_black")}
                            style={styles.icon}
                        />
                    </View>
                </TouchFeedback>

                <TextInput
                    ref={c => this._input = c}
                    autoFocus={this.props.autoFocus}
                    onChange={this._onChange.bind(this)}
                    placeholder={this.props.placeholder}
                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                    onFocus={this.props.onFocus}
                    style={styles.input}
                />

                {this.state.showClear ?
                    <TouchFeedback onPress={this._clearInput.bind(this)}>
                        <View style={styles.iconContainer}>
                            <Image
                                source={require("image!ic_close_black")}
                                style={styles.icon}
                            />
                        </View>
                    </TouchFeedback> :
                    null
                }
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
