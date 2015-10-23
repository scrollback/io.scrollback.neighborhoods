import React from "react-native";
import TouchFeedback from "./touch-feedback";
import Loading from "./loading";

const {
	StyleSheet,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	container: {
		marginVertical: 16
	},
	loader: {
		height: 21,
		width: 21,
		marginHorizontal: 16
	},
	button: {
		backgroundColor: "#673AB7",
		padding: 12,
		borderRadius: 3,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	buttonText: {
		color: "#fff",
		textAlign: "center",
		paddingHorizontal: 4,
		fontSize: 14,
		lineHeight: 21
	}
});

export default class LargeButton extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.text !== nextProps.text ||
			this.props.onPress !== nextProps.onPress ||
			this.props.spinner !== nextProps.spinner ||
			this.props.disabled !== nextProps.disabled
		);
	}

	render() {
		return (
			<View style={styles.container}>
				<TouchFeedback onPress={this.props.disabled ? null : this.props.onPress}>
					<View style={[ styles.button, this.props.style ]}>
						{this.props.spinner ? <Loading style={styles.loader} /> : null}

						<Text style={styles.buttonText}>{this.props.text.toUpperCase()}</Text>
					</View>
				</TouchFeedback>
			</View>
		);
	}
}

LargeButton.propTypes = {
	text: React.PropTypes.string.isRequired,
	onPress: React.PropTypes.func.isRequired,
	spinner: React.PropTypes.bool,
	disabled: React.PropTypes.bool
};
