import React from "react-native";
import Colors from "../../colors.json";
import CloseButton from "./close-button";
import Icon from "./icon";
import Loading from "./loading";

const {
	StyleSheet,
	View,
	Image,
	TouchableHighlight
} = React;

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: 16,
		paddingVertical: 32
	},
	thumbnailContainer: {
		elevation: 4
	},
	thumbnailStyle: {
		alignItems: "center",
		justifyContent: "center"
	},
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
	iconSendContainer: {
		backgroundColor: Colors.accent
	},
	iconCancelContainer: {
		backgroundColor: Colors.fadedBlack
	},
	iconSuccessContainer: {
		backgroundColor: Colors.success
	},
	iconErrorContainer: {
		backgroundColor: Colors.error
	},
	icon: {
		color: Colors.white,
		margin: 16
	},
	iconWarning: {
		marginTop: 14,
		marginBottom: 18
	},
	loading: {
		position: "absolute",
		left: 2,
		top: 2,
		height: 52,
		width: 52
	},
	closeButton: {
		position: "absolute",
		top: 16,
		left: 0
	}
});

export default class ChatInput extends React.Component {
	_onClose() {
		this.props.closeUpload();
	}

	_onPress() {
		if (this.props.status === "loading") {
			this.props.cancelUpload();
		} else if (this.props.status === "idle" || this.props.status === "error") {
			this.props.startUpload();
		}
	}

	render() {
		const { uri, height, width } = this.props.imageData;

		return (
			<View {...this.props} style={[ styles.container, this.props.style ]}>
				<View style={styles.thumbnailContainer}>
					<Image source={{ uri, height: (height / width) * 160, width: 160 }} style={styles.thumbnailStyle}>
						<TouchableHighlight
							onPress={this._onPress.bind(this)}
							underlayColor={Colors.underlay}
							style={styles.iconContainerOuter}
						>

						{(() => {
							switch (this.props.status) {
							case "idle":
								return (
									<View style={[ styles.iconContainer, styles.iconSendContainer ]}>
										<Icon
											name="file-upload"
											style={styles.icon}
											size={24}
										/>
									</View>
								);
							case "loading":
								return (
									<View style={[ styles.iconContainer, styles.iconCancelContainer ]}>
										<Icon
											name="close"
											style={styles.icon}
											size={24}
										/>
										<Loading style={styles.loading} />
									</View>
								);
							case "finished":
								return (
									<View style={[ styles.iconContainer, styles.iconSuccessContainer ]}>
										<Icon
											name="done"
											style={styles.icon}
											size={24}
										/>
									</View>
								);
							case "error":
								return (
									<View style={[ styles.iconContainer, styles.iconErrorContainer ]}>
										<Icon
											name="warning"
											style={[ styles.icon, styles.iconWarning ]}
											size={24}
										/>
									</View>
								);
							}
						}())}
						</TouchableHighlight>
					</Image>
				</View>

				<CloseButton onPress={this._onClose.bind(this)} style={styles.closeButton} />
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
