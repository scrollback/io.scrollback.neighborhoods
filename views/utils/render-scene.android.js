import { BackAndroid } from "react-native";
import Modal from "../components/modal";
import renderSceneBase from "./render-scene-base";

let _navigator;

BackAndroid.addEventListener("hardwareBackPress", () => {
    if (Modal.isShown()) {
        Modal.renderComponent(null);

        return true;
    }

    if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        _navigator.pop();

        return true;
    }

    return false;
});

export default (route, navigator, ...rest) => {
    _navigator = navigator;

    return renderSceneBase(route, navigator, ...rest);
};
