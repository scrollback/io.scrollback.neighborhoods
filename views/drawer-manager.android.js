import React from "react-native";
import Drawer from "./drawer";

const {
    Dimensions,
    DrawerLayoutAndroid
} = React;

const DRAWER_WIDTH_LEFT = 56;

let _drawer;

class DrawerWrapper extends React.Component {
    render() {
        return (
                <DrawerLayoutAndroid
                    ref={c => _drawer = c}
                    drawerWidth={Dimensions.get("window").width - DRAWER_WIDTH_LEFT}
                    drawerPosition={DrawerLayoutAndroid.positions.Left}
                    keyboardDismissMode="on-drag"
                    renderNavigationView={() => <Drawer />}
                >
                    {this.props.children}
                </DrawerLayoutAndroid>
        );
    }
}

DrawerWrapper.propTypes = {
    children: React.PropTypes.node
};

const DrawerManager = {
    showDrawer() {
        if (_drawer) {
            _drawer.openDrawer();
        }
    },

    hideDrawer() {
        if (_drawer) {
            _drawer.closeDrawer();
        }
    },

    DrawerWrapper
};

export default DrawerManager;
