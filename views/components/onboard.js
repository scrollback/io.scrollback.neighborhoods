import React from "react-native";
import renderScene from "../utils/render-scene";
import routes from "../utils/routes";

const {
    Navigator
} = React;

export default class Onboard extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={routes.signin({ initialRoute: this.props.initialRoute })}
                renderScene={renderScene}
            />
        );
    }
}

Onboard.propTypes = {
    initialRoute: React.PropTypes.object
};
