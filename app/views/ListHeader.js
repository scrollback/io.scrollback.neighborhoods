import React from "react-native";
import AppText from "./AppText";
import Colors from "../../Colors.json";

const {
	View,
	StyleSheet
} = React;

const styles = StyleSheet.create({
	header: {
		paddingHorizontal: 16,
		paddingVertical: 12
	},
	headerText: {
		color: Colors.fadedBlack,
		fontSize: 12,
		lineHeight: 18,
		fontWeight: "bold"
	}
});

const ListHeader = ({ children }) => {
	return (
		<View style={styles.header}>
			<AppText style={styles.headerText}>{children.toUpperCase()}</AppText>
		</View>
	);
};

ListHeader.propTypes = {
	children: React.PropTypes.string.isRequired
};

export default ListHeader;
