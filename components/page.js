import React from "react-native";

const {
    StyleSheet,
    View
} = React;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        alignItems: "stretch",
        backgroundColor: "#eee"
    }
});

export default class Page extends React.Component {
    render() {
        return (
            <View {...this.props} style={[ styles.page, this.props.style ]}>
                {this.props.children}
            </View>
        );
    }
}

Page.propTypes = {
    children: React.PropTypes.any.isRequired
};
