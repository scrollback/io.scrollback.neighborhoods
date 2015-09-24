import React from "react-native";

const {
    StyleSheet,
    View
} = React;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    }
});

export default class PageRetry extends React.Component {
    render() {
        return (
            <View style={styles.page}>
                {this.props.children}
            </View>
        );
    }
}

PageRetry.propTypes = {
    children: React.PropTypes.any.isRequired
};
