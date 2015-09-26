import React from "react-native";
import Page from "./page";

const {
    Text
} = React;

export default class PageLoading extends React.Component {
    render() {
        return (
            <Page {...this.props}>
                <Text>No results found.</Text>
            </Page>
        );
    }
}
