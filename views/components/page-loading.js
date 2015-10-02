import React from "react-native";
import Loading from "./loading";
import Page from "./page";

const {
    StyleSheet
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
                <Loading style={styles.loading} />
            </Page>
        );
    }
}
