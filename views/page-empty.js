import React from "react-native";
import Page from "./page";

const {
    StyleSheet,
    Text
} = React;

const styles = StyleSheet.create({
    loading: {
        height: 36,
        width: 36
    }
});

export default class PageLoading extends React.Component {
    render() {
        return (
            <Page {...this.props}>
                <Text>No results found.</Text>
            </Page>
        );
    }
}
