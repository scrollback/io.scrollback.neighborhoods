import React from "react-native";

const {
    StyleSheet,
    Text
} = React;

const styles = StyleSheet.create({
    title: {
        fontWeight: "bold",
        color: "#333",
        fontSize: 14,
        lineHeight: 24
    }
});

export default class CardTitle extends React.Component {
    render() {
        return (
            <Text numberOfLines={2} {...this.props} style={[ styles.title, this.props.style ]}>
                {this.props.text}
            </Text>
        );
    }
}

CardTitle.propTypes = {
    text: React.PropTypes.string.isRequired
};
