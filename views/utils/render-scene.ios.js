import React from "react-native";

const {
    StyleSheet
} = React;

const styles = StyleSheet.create({
    scene: {
        flex: 1
    }
});

export default (route, navigator) => {
    return (
        <route.component
            {...route.passProps}
            navigator={navigator}
            style={styles.scene}
        />
    );
};
