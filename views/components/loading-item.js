import React from "react-native";
import LoadingFancy from "./loading-fancy";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		alignSelf: "stretch",
		alignItems: "center"
	}
});

export default class LoadingItem extends React.Component {
	render() {
		return (
			<View style={[ styles.container, this.props.style ]}>
				<LoadingFancy />
			</View>
		);
	}
}
