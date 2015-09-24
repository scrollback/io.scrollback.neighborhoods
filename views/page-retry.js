import React from "react-native";
import Page from "./page";

const {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} = React;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    failed: {
        fontSize: 18
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16
    },
    label: {
        paddingHorizontal: 8,
        marginHorizontal: 8
    },
    icon: {
        height: 24,
        width: 24,
        opacity: 0.5
    }
});

export default class PageRetry extends React.Component {
    render() {
        return (
            <Page {...this.props}>
                <TouchableOpacity onPress={this.props.onRetry} style={styles.container}>
                    <Text style={styles.failed}>Failed to load data</Text>
                    {this.props.onRetry ?
                    <View style={styles.button}>
                        <Image style={styles.icon} source={require("image!ic_refresh_black")} />
                        <Text style={styles.label}>Retry</Text>
                    </View> :
                    null
                }
                </TouchableOpacity>
            </Page>
        );
    }
}

PageRetry.propTypes = {
    onRetry: React.PropTypes.func
};
