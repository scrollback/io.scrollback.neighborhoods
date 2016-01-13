/* @flow */
/* eslint-disable react/no-multi-comp */

import React from "react-native";
import Appbar from "./Appbar";
import routeMapper from "../routes/routeMapper";

const renderOverlay = function(navState: Object, onNavigation: Function): Function {
	return props => {
		const route = navState.get(navState.index);

		if (route.fullscreen) {
			return null;
		}

		const {
			title,
			titleComponent,
			leftComponent,
			rightComponent,
			passProps
		} = routeMapper(route);

		return (
			<Appbar
				{...props}
				route={route}
				title={title}
				titleComponent={titleComponent}
				leftComponent={leftComponent}
				rightComponent={rightComponent}
				onNavigation={onNavigation}
				passProps={passProps}
			/>
		);
	};
};

export default renderOverlay;
