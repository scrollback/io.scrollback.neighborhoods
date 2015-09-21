import React from "react-native";
import Loading from "./loading";

const {
    StyleSheet,
    View
} = React;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    loading: {
        height: 36,
        width: 36
    }
});

export default class PageLoading extends React.Component {
    render() {
        return (
            <View style={styles.loadingContainer}>
                <Loading style={styles.loading} />
            </View>
        );
    }
}
