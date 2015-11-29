import React from "react-native";
import Colors from "../../colors.json";
import Modal from "./modal";
import StatusbarContainer from "./statusbar-container";
import KeyboardSpacer from "./keyboard-spacer";
import renderNavigationBar from "../utils/render-navigation-bar";
import renderScene from "../utils/render-scene";
import routes from "../utils/routes";

const {
	StyleSheet,
	Navigator
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	statusbar: {
		backgroundColor: Colors.primary
	},
	scene: {
		marginTop: 56, // offset for appbar height
		backgroundColor: Colors.lightGrey
	}
});

export default class Home extends React.Component {
	render() {
		return (
			<StatusbarContainer style={styles.container} statusbarStyle={styles.statusbar}>
				<Navigator
					initialRoute={this.props.initialRoute || routes.home()}
					renderScene={renderScene}
					navigationBar={renderNavigationBar()}
					configureScene={() => Navigator.SceneConfigs.FloatFromBottomAndroid}
					sceneStyle={styles.scene}
				/>

				<KeyboardSpacer />
				<Modal />
			</StatusbarContainer>
		);
	}
}

Home.propTypes = {
	initialRoute: React.PropTypes.object
};
