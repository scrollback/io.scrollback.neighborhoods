/* @flow */

import React from "react-native";
import PlaceManager from "./PlaceManager";
import PageLoading from "../PageLoading";
import Colors from "../../../Colors.json";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.white,
		marginVertical: 8
	}
});

const MyPlaces = props => {
	if (props.places && props.places.length === 1 && props.places[0] === "missing") {
		return <PageLoading />;
	}

	return <PlaceManager {...props} style={[ styles.container, props.style ]} />;
};

MyPlaces.propTypes = {
	style: View.propTypes.style,
	places: React.PropTypes.array
};

export default MyPlaces;
