import React from "react-native";

const {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} = React;

const styles = StyleSheet.create({
    loadingContainer: {
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
        marginLeft: 8
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
            <View style={styles.loadingContainer}>
                <Text style={styles.failed}>Failed to load data</Text>
                {this.props.onRetry ?
                    <TouchableOpacity onPress={this.props.onRetry}>
                        <View style={styles.button}>
                            <Image style={styles.icon} source={require("image!ic_refresh_black")} />
                            <Text style={styles.label}>Retry</Text>
                        </View>
                    </TouchableOpacity> :
                    null
                }
            </View>
        );
    }
}

PageRetry.propTypes = {
    onRetry: React.PropTypes.func
};
