import React from "react-native";

const {
    StyleSheet,
    Text
} = React;

const styles = StyleSheet.create({
    hashtags: {
        fontSize: 12,
        lineHeight: 21,
        color: "#0af"
    }
});

export default class CardHashtags extends React.Component {
    render() {
        return (
            <Text {...this.props} style={[ styles.hashtags, this.props.style ]}>
                {this.props.hashtags.join(" ")}
            </Text>
        );
    }
}

CardHashtags.propTypes = {
    hashtags: React.PropTypes.arrayOf(React.PropTypes.string)
};
