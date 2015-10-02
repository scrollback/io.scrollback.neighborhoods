import React from "react-native";
import NavigationBar from "../utils/navigation-bar";
import renderScene from "../utils/render-scene";
import routes from "../utils/routes";

const {
    StyleSheet,
    Navigator
} = React;

const styles = StyleSheet.create({
    scene: {
        marginTop: 56,
        backgroundColor: "#eee"
    }
});

export default class Home extends React.Component {
    render() {
        return (
            <Navigator
                initialRoute={this.props.initialRoute || routes.home()}
                renderScene={renderScene}
                navigationBar={NavigationBar}
                sceneStyle={styles.scene}
            />
        );
    }
}

Home.propTypes = {
    initialRoute: React.PropTypes.object
};
