/* @flow */

import React from "react-native";
import renderNavigator from "./renderNavigator";

const {
	NavigationContainer,
	NavigationState
} = React;

const stateToString = (navState) => {
	return JSON.stringify({
		index: navState.index,
		routes: navState.toArray().map(JSON.stringify),
	});
};

const stringToState = (navString) => {
	const { routes, index } = JSON.parse(navString);

	return new NavigationState(routes.map(JSON.parse), index);
};

const PersistentNavigator = (props: Object): ReactElement => (
	<NavigationContainer.RootContainer
		initialState={props.initialState}
		persistenceKey={props.persistenceKey}
		stateToString={stateToString}
		stringToState={stringToState}
		renderNavigator={renderNavigator}
	/>
);

PersistentNavigator.propTypes = {
	initialState: React.PropTypes.any.isRequired,
	persistenceKey: React.PropTypes.string
};

export default PersistentNavigator;
