import React from "react-native";
import Colors from "../../colors.json";
import Icon from "./icon";
import Loading from "./loading";

const {
	StyleSheet,
	TouchableHighlight,
	View
} = React;

const styles = StyleSheet.create({
	iconContainerOuter: {
		height: 56,
		width: 56,
		borderRadius: 32,
		margin: 8
	},
	iconContainer: {
		alignItems: "center",
		justifyContent: "center",
		height: 56,
		width: 56,
		borderRadius: 32
	},
	idleIconContainer: {
		backgroundColor: Colors.accent
	},
	closeIconContainer: {
		backgroundColor: Colors.fadedBlack
	},
	doneIconContainer: {
		backgroundColor: Colors.success
	},
	errorIconContainer: {
		backgroundColor: Colors.error
	},
	icon: {
		color: Colors.white,
		margin: 16
	},
	loading: {
		position: "absolute",
		left: 2,
		top: 2,
		height: 52,
		width: 52
	}
});

export default class ImageUploadButton extends React.Component {
	render() {
		let containerStyle, iconStyle, iconName;

		switch (this.props.status) {
		case "loading":
			containerStyle = styles.closeIconContainer;
			iconStyle = this.props.closeIconStyle;
			iconName = this.props.closeIcon;
			break;
		case "finished":
			containerStyle = styles.doneIconContainer;
			iconStyle = this.props.doneIconStyle;
			iconName = this.props.doneIcon;
			break;
		case "error":
			containerStyle = styles.errorIconContainer;
			iconStyle = this.props.errorIconStyle;
			iconName = this.props.errorIcon;
			break;
		default:
			containerStyle = styles.idleIconContainer;
			iconStyle = this.props.idleIconStyle;
			iconName = this.props.idleIcon;
		}

		return (
			<TouchableHighlight
				{...this.props}
				underlayColor={Colors.underlay}
				style={[ styles.iconContainerOuter, this.props.style ]}
			>
				<View style={[ styles.iconContainer, containerStyle ]}>
					<Icon
						name={iconName}
						style={[ styles.icon, iconStyle ]}
						size={24}
					/>

					{this.props.status === "loading" ? <Loading style={styles.loading} /> : null}
				</View>
			</TouchableHighlight>
		);
	}
}

ImageUploadButton.propTypes = {
	status: React.PropTypes.string.isRequired,
	closeIcon: React.PropTypes.string.isRequired,
	closeIconStyle: React.PropTypes.any,
	doneIcon: React.PropTypes.string.isRequired,
	doneIconStyle: React.PropTypes.any,
	errorIcon: React.PropTypes.string.isRequired,
	errorIconStyle: React.PropTypes.any,
	idleIcon: React.PropTypes.string.isRequired,
	idleIconStyle: React.PropTypes.any
};
