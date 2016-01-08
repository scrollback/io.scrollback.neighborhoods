import React from "react-native";
import Colors from "../../Colors.json";
import Modal from "./Modal";
import StatusbarContainer from "./StatusbarContainer";
import KeyboardSpacer from "./KeyboardSpacer";
import renderNavigationBar from "../utils/renderNavigationBar";
import renderScene from "../utils/renderScene";
import routes from "../utils/routes";
import VersionCodes from "../modules/VersionCodes";

const {
	Platform,
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

				{Platform.Version >= VersionCodes.KITKAT ?
					<KeyboardSpacer /> :
					null // Android seems to Pan the screen on < Kitkat
				}

				<Modal />
			</StatusbarContainer>
		);
	}
}

Home.propTypes = {
	initialRoute: React.PropTypes.object
};
