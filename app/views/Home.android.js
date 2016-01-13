/* @flow */

import React from "react-native";
import Colors from "../../Colors.json";
import Modal from "./Modal";
import PersistentNavigator from "../navigation/PersistentNavigator";
import StatusbarContainer from "./StatusbarContainer";
import KeyboardSpacer from "./KeyboardSpacer";
import VersionCodes from "../modules/VersionCodes";

const {
	Platform,
	NavigationState,
	StyleSheet
} = React;

const PERSISTANCE_KEY = __DEV__ ? "FLAT_PERSISTENCE_0" : null;

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
		const { routes, index } = this.props.initialNavigationState;

		return (
			<StatusbarContainer style={styles.container} statusbarStyle={styles.statusbar}>
				<PersistentNavigator
					initialState={new NavigationState(routes, index)}
					persistenceKey={PERSISTANCE_KEY}
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
	initialNavigationState: React.PropTypes.object
};
