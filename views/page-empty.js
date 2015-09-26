import React from "react-native";
import Page from "./page";

const {
    StyleSheet,
    Text
} = React;

const styles = StyleSheet.create({
    label: {
        fontSize: 18,
        paddingHorizontal: 8,
        marginHorizontal: 8
    }
});

export default class PageLoading extends React.Component {
    render() {
        return (
            <Page {...this.props}>
                <Text style={styles.label}>No results found.</Text>
            </Page>
        );
    }
}
