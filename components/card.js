import React from "react-native";

const {
    StyleSheet,
    View
} = React;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderColor: "rgba(0, 0, 0, .08)",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        marginTop: 8,
        marginBottom: 8
    }
});

export default class Card extends React.Component {
    render() {
        return (
            <View {...this.props} style={[ styles.card, this.props.style ]}>
                {this.props.children}
            </View>
        );
    }
}

Card.propTypes = {
    children: React.PropTypes.any
};
