import React from "react-native";
import Colors from "../../Colors.json";
import CloseButton from "./CloseButton";
import ImageUploadButton from "./ImageUploadButton";

const {
	StyleSheet,
	View,
	Image
} = React;

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		right: 0,
		bottom: 0,
		padding: 8
	},
	thumbnailContainer: {
		elevation: 4
	},
	thumbnailStyle: {
		alignItems: "flex-end",
		justifyContent: "flex-end"
	},
	iconIdle: {
		color: Colors.fadedBlack,
		marginRight: 13,
		marginLeft: 19
	},
	iconError: {
		marginTop: 14,
		marginBottom: 18
	},
	closeButton: {
		position: "absolute",
		top: -8,
		left: -8
	}
});

export default class ChatInput extends React.Component {
	_onClose = () => {
		this.props.closeUpload();
	};

	_onPress = () => {
		if (this.props.status === "loading") {
			this.props.cancelUpload();
		} else if (this.props.status === "idle" || this.props.status === "error") {
			this.props.startUpload();
		}
	};

	render() {
		const { uri, height, width } = this.props.imageData;

		return (
			<View {...this.props} style={[ styles.container, this.props.style ]}>
				<View style={styles.thumbnailContainer}>
					<Image source={{ uri, height: (height / width) * 160, width: 160 }} style={styles.thumbnailStyle}>
						<ImageUploadButton
							onPress={this._onPress}
							status={this.props.status}
							idleIcon="send"
							closeIcon="close"
							doneIcon="done"
							errorIcon="warning"
							idleIconStyle={styles.iconIdle}
							errorIconStyle={styles.iconError}
						/>
					</Image>
				</View>

				<CloseButton onPress={this._onClose} style={styles.closeButton} />
			</View>
		);
	}
}

ChatInput.propTypes = {
	imageData: React.PropTypes.shape({
		name: React.PropTypes.string.isRequired,
		uri: React.PropTypes.string.isRequired,
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		size: React.PropTypes.number.isRequired
	}).isRequired,
	status: React.PropTypes.string.isRequired,
	startUpload: React.PropTypes.func.isRequired,
	cancelUpload: React.PropTypes.func.isRequired,
	closeUpload: React.PropTypes.func.isRequired
};
