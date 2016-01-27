/* @flow */

import React from "react-native";
import Colors from "../../Colors.json";
import Modal from "./Modal";
import PersistentNavigator from "../navigation/PersistentNavigator";
import StatusbarContainer from "./StatusbarContainer";
import KeyboardSpacer from "./KeyboardSpacer";
import VersionCodes from "../modules/VersionCodes";
import { getHomeRoute, convertRouteToState, convertURLToState } from "../routes/Route";

const {
	Platform,
	StyleSheet
} = React;

const PERSISTANCE_KEY = __DEV__ ? "FLAT_PERSISTENCE_0" : null;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	statusbar: {
		backgroundColor: Colors.primary
	}
});

const Home = (props: { initialURL: string }) => {
	const { initialURL } = props;
	const navigationState = initialURL ? convertURLToState(initialURL) : convertRouteToState(getHomeRoute());

	return (
		<StatusbarContainer style={styles.container} statusbarStyle={styles.statusbar}>
			<PersistentNavigator
				initialState={navigationState}
				persistenceKey={initialURL ? null : PERSISTANCE_KEY}
			/>

			{Platform.Version >= VersionCodes.KITKAT ?
				<KeyboardSpacer /> :
				null // Android seems to Pan the screen on < Kitkat
			}

			<Modal />
		</StatusbarContainer>
	);
};

Home.propTypes = {
	initialURL: React.PropTypes.string
};

export default Home;
