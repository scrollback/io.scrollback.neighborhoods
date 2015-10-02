import React from "react-native";
import NavigationBar from "../utils/navigation-bar";
import renderScene from "../utils/render-scene";
import routes from "../utils/routes";

const {
    Navigator
} = React;

export default class App extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={routes.home()}
                renderScene={renderScene}
                navigationBar={NavigationBar}
            />
        );
    }
}
