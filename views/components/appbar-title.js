import React from "react-native";
import Colors from "../../colors.json";
import AppText from "./app-text";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	titleContainer: {
		flex: 1,
		marginVertical: 15,
		marginHorizontal: 4,
		marginRight: 64
	},
	titleText: {
		color: Colors.darkGrey,
		fontWeight: "bold",
		fontSize: 18,
		lineHeight: 27,
		paddingHorizontal: 4
	}
});

export default class AppbarTitle extends React.Component {
	render() {
		return (
			<View {...this.props} style={[ styles.titleContainer, this.props.style ]}>
				<AppText style={[ styles.titleText, this.props.textStyle ]} numberOfLines={1}>
					{this.props.children}
				</AppText>
			</View>
		);
	}
}

AppbarTitle.propTypes = {
	children: React.PropTypes.string.isRequired,
	textStyle: React.PropTypes.any
};
