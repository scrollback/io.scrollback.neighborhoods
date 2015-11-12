import React from "react-native";
import Colors from "../../colors.json";

const {
	StyleSheet,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	titleContainer: {
		flex: 1,
		marginVertical: 14,
		marginHorizontal: 4,
		marginRight: 64
	},
	titleText: {
		color: Colors.darkGrey,
		fontWeight: "bold",
		fontSize: 18,
		paddingHorizontal: 4
	}
});

export default class AppbarTitle extends React.Component {
	render() {
		return (
			<View {...this.props} style={[ styles.titleContainer, this.props.style ]}>
				<Text style={[ styles.titleText, this.props.textStyle ]} numberOfLines={1}>
					{this.props.children}
				</Text>
			</View>
		);
	}
}

AppbarTitle.propTypes = {
	children: React.PropTypes.string.isRequired,
	textStyle: React.PropTypes.any
};
