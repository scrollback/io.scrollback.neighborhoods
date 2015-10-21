import React from "react-native";
import Loading from "./loading";
import AppbarTouchable from "./appbar-touchable";
import AppbarIcon from "./appbar-icon";
import GrowingTextInput from "./growing-text-input";
import TouchFeedback from "./touch-feedback";
import Icon from "./icon";
import ImageUploadController from "../controllers/image-upload-controller";
import ImageUploadDiscussion from "./image-upload-discussion";
import ImageChooser from "../../modules/image-chooser";
import DeviceVersion from "../../modules/device-version";
import textUtils from "../../lib/text-utils";

const {
	PixelRatio,
	StyleSheet,
	ScrollView,
	View,
	Text,
	TextInput
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	},
	statusbar: {
		height: DeviceVersion.VERSION_SDK_INT < DeviceVersion.VERSION_CODES_KITKAT ? 0 : 25 // offset for statusbar height
	},
	appbar: {
		flexDirection: "row",
		alignItems: "stretch",
		justifyContent: "space-between",
		height: 56,
		borderColor: "rgba(0, 0, 0, .16)",
		borderBottomWidth: 1 / PixelRatio.get(),
		paddingHorizontal: 4
	},
	titleText: {
		color: "#555",
		fontWeight: "bold",
		fontSize: 18,
		marginVertical: 14,
		marginRight: 64,
		paddingHorizontal: 4,
		marginHorizontal: 4
	},
	icon: {
		color: "#555"
	},
	scene: {
		padding: 16,
		backgroundColor: "#fff"
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center"
	},
	buttonText: {
		color: "#673AB7",
		fontWeight: "bold",
		fontSize: 14,
		lineHeight: 21,
		marginRight: 16
	},
	buttonIcon: {
		color: "#673AB7",
		fontSize: 24,
		marginHorizontal: 12
	},
	loading: {
		height: 19,
		width: 19,
		margin: 18
	},
	uploadButton: {
		flexDirection: "row",
		alignSelf: "flex-start",
		alignItems: "center",
		marginVertical: 12
	},
	uploadButtonText: {
		fontWeight: "bold",
		fontSize: 12,
		paddingHorizontal: 4,
		marginRight: 8
	},
	uploadButtonIcon: {
		color: "#000",
		fontSize: 24,
		opacity: 0.5,
		margin: 8
	}
});

export default class StartDiscussionButton extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "",
			text: "",
			imageData: null,
			uploadResult: null,
			status: null
		};
	}

	_onPress() {
		if (this.state.status === "loading") {
			return;
		}

		if (this.state.title) {
			if (this.state.text) {
				this.props.postDiscussion(this.state.title, this.state.text);
			} else if (this.state.uploadResult) {
				const result = this.state.uploadResult;
				const { height, width, name } = this.state.imageData;
				const aspectRatio = height / width;

				this.props.postDiscussion(this.state.title, textUtils.getTextFromMetadata({
					type: "image",
					caption: name,
					height: 160 * aspectRatio,
					width: 160,
					thumbnailUrl: result.thumbnailUrl,
					originalUrl: result.originalUrl
				}), result.textId);
			} else {
				return;
			}

			this.setState({
				status: "loading"
			});
		}
	}

	_onTitleChange(e) {
		this.setState({
			title: e.nativeEvent.text
		});
	}

	_onTextChange(e) {
		this.setState({
			text: e.nativeEvent.text
		});
	}

	_uploadImage() {
		ImageChooser.pickImage(result => {
			if (result.type === "success") {
				this.setState({
					imageData: result
				});
			}
		});
	}

	_onUploadFinish(result) {
		this.setState({
			uploadResult: result
		});
	}

	_onUploadClose() {
		this.setState({
			imageData: null,
			uploadResult: null
		});
	}

	render() {
		const isLoading = this.state.status === "loading";

		return (
			<View style={styles.container}>
				<View style={styles.statusbar} />

				<View style={styles.appbar}>
					<AppbarTouchable onPress={this.props.dismiss}>
						<AppbarIcon name="close" style={styles.icon} />
					</AppbarTouchable>

					<AppbarTouchable onPress={this._onPress.bind(this)}>
						{isLoading ?
							<Loading style={styles.loading} /> :
							(<View style={styles.button}>
								<AppbarIcon name="done" style={styles.buttonIcon} />
								<Text style={styles.buttonText}>POST</Text>
							</View>)
						}
					</AppbarTouchable>
				</View>

				<ScrollView style={styles.scene}>
					<TextInput
						autoFocus
						value={this.state.title}
						onChange={this._onTitleChange.bind(this)}
						placeholder="Enter discussion title"
						autoCapitalize="sentences"
					/>

					{this.state.imageData ?
						<ImageUploadController
							component={ImageUploadDiscussion}
							imageData={this.state.imageData}
							onUploadClose={this._onUploadClose.bind(this)}
							onUploadFinish={this._onUploadFinish.bind(this)}
							autoStart
						/> :
						<GrowingTextInput
							numberOfLines={5}
							value={this.state.text}
							onChange={this._onTextChange.bind(this)}
							placeholder="Enter discussion summary"
							autoCapitalize="sentences"
						/>
					}

					{this.state.imageData ? null :
						<TouchFeedback onPress={this._uploadImage.bind(this)}>
							<View style={styles.uploadButton}>
								<Icon name="image" style={styles.uploadButtonIcon} />
								<Text style={styles.uploadButtonText}>UPLOAD AN IMAGE</Text>
							</View>
						</TouchFeedback>
					}
				</ScrollView>
			</View>
		);
	}
}

StartDiscussionButton.propTypes = {
	room: React.PropTypes.string.isRequired,
	dismiss: React.PropTypes.func.isRequired,
	postDiscussion: React.PropTypes.func.isRequired
};
