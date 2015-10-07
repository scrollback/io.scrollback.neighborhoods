import React from "react-native";
import GrowingTextInput from "./growing-text-input";
import LargeButton from "./large-button";

const {
    StyleSheet,
    View,
    TextInput
} = React;

const styles = StyleSheet.create({
    container: {
        padding: 16
    }
});

export default class StartDiscussionButton extends React.Component {
    _onPress() {
        this.props.postDiscussion();
    }

    render() {
        return (
            <View {...this.props} style={[ styles.container, this.props.style ]}>
                <TextInput placeholder="Enter discussion title" autoFocus />
                <GrowingTextInput placeholder="Enter discussion summary" numberOfLines={5} />
                <LargeButton
                    style={styles.facebook}
                    text="Start discussion"
                    onPress={this._onPress.bind(this)}
                />
            </View>
        );
    }
}

StartDiscussionButton.propTypes = {
    room: React.PropTypes.string.isRequired,
    postDiscussion: React.PropTypes.func.isRequired
};
