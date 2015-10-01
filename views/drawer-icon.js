import React from "react-native";
import DrawerManager from "./drawer-manager";

const {
    StyleSheet,
    TouchableHighlight,
    Image
} = React;

const styles = StyleSheet.create({
    icon: {
        height: 24,
        width: 24,
        margin: 16
    }
});

export default class DrawerIcon extends React.Component {
    _onPress() {
        DrawerManager.showDrawer();
    }

    render() {
        return (
            <TouchableHighlight underlayColor="rgba(0, 0, 0, .16)" onPress={this._onPress.bind(this)}>
                <Image source={require("image!ic_menu_white")} style={styles.icon} />
            </TouchableHighlight>
        );
    }
}
