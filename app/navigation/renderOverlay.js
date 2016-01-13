/* @flow */
/* eslint-disable react/no-multi-comp */

import React from "react-native";
import Appbar from "./Appbar";

const renderOverlay = (): Function => {
	return props => <Appbar {...props} />;
};

export default renderOverlay;
