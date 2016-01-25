import React from "react-native";
import TouchFeedback from "./TouchFeedback";
import Colors from "../../Colors.json";

const {
	StyleSheet,
	PixelRatio,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.white,
		borderColor: Colors.separator,
		borderBottomWidth: 1 / PixelRatio.get(),
		height: 64
	},
});

const ListItem = props => (
	<TouchFeedback {...props}>
		<View style={styles.container}>
			{props.children}
		</View>
	</TouchFeedback>
);

ListItem.propTypes = {
	children: React.PropTypes.node.isRequired
};

export default ListItem;
