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
        marginVertical: 4
    }
});

export default class Card extends React.Component {
    setNativeProps(nativeProps) {
        this._root.setNativeProps(nativeProps);
    }

    render() {
        return (
            <View
                {...this.props}
                style={[ styles.card, this.props.style ]}
                ref={c => this._root = c}
            >
                {this.props.children}
            </View>
        );
    }
}

Card.propTypes = {
    children: React.PropTypes.node
};
