import React from "react-native";
import RichText from "./rich-text";

const {
    StyleSheet
} = React;

const styles = StyleSheet.create({
    summary: { color: "#999" }
});

export default class TextSummary extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (this.props.text !== nextProps.text);
    }

    render() {
        return (
            <RichText numberOfLines={3} {...this.props} style={[ styles.summary, this.props.style ]} text={this.props.text} />
        );
    }
}

TextSummary.propTypes = {
    text: React.PropTypes.string.isRequired
};
