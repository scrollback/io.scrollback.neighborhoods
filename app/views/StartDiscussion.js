import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import AppTextInput from "./AppTextInput";
import StatusbarContainer from "./StatusbarContainer";
import AppbarSecondary from "./AppbarSecondary";
import AppbarTouchable from "./AppbarTouchable";
import AppbarIcon from "./AppbarIcon";
import GrowingTextInput from "./GrowingTextInput";
import TouchFeedback from "./TouchFeedback";
import Icon from "./Icon";
import UserIconContainer from "../containers/UserIconContainer";
import ImageUploadContainer from "../containers/ImageUploadContainer";
import Banner from "./Banner";
import CheckboxLabeled from "./CheckboxLabeled";
import ImageUploadDiscussion from "./ImageUploadDiscussion";
import ImageChooser from "../modules/ImageChooser";
import routes from "../utils/routes";
import textUtils from "../lib/text-utils";

const {
	AsyncStorage,
	StyleSheet,
	ScrollView,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},
	scene: {
		paddingHorizontal: 8,
		paddingVertical: 16
	},
	threadTitle: {
		fontWeight: "bold",
		fontSize: 20,
		lineHeight: 30
	},
	threadSummary: {
		fontSize: 16,
		lineHeight: 24
	},
	icon: {
		color: Colors.fadedBlack
	},
	disabled: {
		opacity: 0.5
	},
	userIcon: {
		margin: 12
	},
	entry: {
		paddingVertical: 4,
		paddingHorizontal: 12
	},
	uploadButtonIcon: {
		color: Colors.fadedBlack,
		marginHorizontal: 16,
		marginVertical: 14
	},
	uploadButtonIconActive: {
		color: Colors.info
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderTopColor: Colors.separator,
		borderTopWidth: 1
	},
	postButton: {
		backgroundColor: Colors.info,
		margin: 6,
		width: 100,
		borderRadius: 3
	},
	postButtonInner: {
		paddingVertical: 10,
		paddingHorizontal: 16
	},
	postButtonText: {
		color: Colors.white,
		fontWeight: "bold",
		textAlign: "center"
	}
});

const FACEBOOK_SHARE_CHECKED_KEY = "start_discussion_facebook_share_checked";

export default class StartDiscussionButton extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "",
			text: "",
			imageData: null,
			uploadResult: null,
			status: null,
			error: null,
			shareOnFacebook: false
		};
	}

	componentDidMount() {
		this._setShareCheckbox();
	}

	_onSharePress() {
		const shareOnFacebook = !this.state.shareOnFacebook;

		this.setState({
			shareOnFacebook
		});

		if (shareOnFacebook) {
			requestAnimationFrame(async () => {
				try {
					await this.props.requestFacebookPermissions();

					AsyncStorage.setItem(FACEBOOK_SHARE_CHECKED_KEY, "true");
				} catch (err) {
					this.setState({
						shareOnFacebook: false
					});

					AsyncStorage.setItem(FACEBOOK_SHARE_CHECKED_KEY, "false");
				}
			});
		}
	}

	async _setShareCheckbox() {
		try {
			const shareOnFacebook = JSON.parse(await AsyncStorage.getItem(FACEBOOK_SHARE_CHECKED_KEY));

			if (shareOnFacebook) {
				const granted = await this.props.isFacebookPermissionGranted();

				this.setState({
					shareOnFacebook: granted
				});
			} else {
				this.setState({
					shareOnFacebook
				});
			}
		} catch (err) {
			this.setState({
				shareOnFacebook: false
			});
		}
	}

	_onLoading() {
		this.setState({
			status: "loading"
		});
	}

	_onPosted(thread) {
		this.props.navigator.push(routes.chat({
			thread: thread.id,
			room: this.props.room
		}));
	}

	_onError(message) {
		this.setState({
			error: message,
			status: null
		});
	}

	async _postDiscussion() {
		const FAIL_MESSAGE = "An error occurred while posting";
		const SHORT_TITLE_MESSAGE = "Title needs be at least 2 words";
		const LONG_TITLE_MESSAGE = "Title needs be less than 10 words";
		const NO_TITLE_MESSAGE = "Enter a title in 2 to 10 words";
		const NO_SUMMARY_MESSAGE = "Enter a short summary";

		if (!this.state.title) {
			this._onError(NO_TITLE_MESSAGE);
			return;
		}

		const words = this.state.title.trim().split(/\s+/);

		if (words.length < 2) {
			this._onError(SHORT_TITLE_MESSAGE);
			return;
		} else if (words.length > 10) {
			this._onError(LONG_TITLE_MESSAGE);
			return;
		}

		if (this.state.uploadResult) {
			const result = this.state.uploadResult;
			const { height, width, name } = this.state.imageData;
			const aspectRatio = height / width;

			try {
				this._onLoading();

				const thread = await this.props.postDiscussion({
					title: this.state.title,
					text: textUtils.getTextFromMetadata({
						type: "photo",
						title: name,
						url: result.originalUrl,
						height,
						width,
						thumbnail_height: Math.min(480, width) * aspectRatio,
						thumbnail_width: Math.min(480, width),
						thumbnail_url: result.thumbnailUrl
					}),
					thread: result.textId,
					image: result.thumbnailUrl
				}, this.state.shareOnFacebook);

				this._onPosted(thread);
			} catch (e) {
				this._onError(FAIL_MESSAGE);
			}
		} else if (this.state.text) {
			try {
				this._onLoading();

				const thread = await this.props.postDiscussion({
					title: this.state.title,
					text: this.state.text
				}, this.state.shareOnFacebook);

				this._onPosted(thread);
			} catch (e) {
				this._onError(FAIL_MESSAGE);
			}
		} else {
			this._onError(NO_SUMMARY_MESSAGE);
		}
	}

	_onPress() {
		if (this.state.status === "loading") {
			return;
		}

		this._postDiscussion();
	}

	_onTitleChange(e) {
		this.setState({
			title: e.nativeEvent.text,
			error: null
		});
	}

	_onTextChange(e) {
		this.setState({
			text: e.nativeEvent.text,
			error: null
		});
	}

	async _uploadImage() {
		try {
			this.setState({
				imageData: null
			});

			const imageData = await ImageChooser.pickImage();

			this.setState({
				imageData
			});
		} catch (e) {
			// Do nothing
		}
	}

	_onUploadFinish(result) {
		this.setState({
			uploadResult: result,
			error: null
		});
	}

	_onUploadClose() {
		this.setState({
			imageData: null,
			uploadResult: null,
			error: null
		});
	}

	render() {
		const isLoading = this.state.status === "loading";
		const isDisabled = !(this.state.title && (this.state.text || this.state.uploadResult) && !isLoading);

		return (
			<StatusbarContainer style={styles.container}>
				<AppbarSecondary>
					<AppbarTouchable type="secondary" onPress={this.props.dismiss}>
						<AppbarIcon name="close" style={styles.icon} />
					</AppbarTouchable>

					<UserIconContainer style={styles.userIcon} size={30} />
				</AppbarSecondary>

				<Banner text={this.state.error} type="error" />

				<ScrollView style={styles.scene} keyboardShouldPersistTaps>
					<AppTextInput
						autoFocus
						value={this.state.title}
						onChange={this._onTitleChange.bind(this)}
						placeholder="Write a discussion title"
						autoCapitalize="sentences"
						style={[ styles.threadTitle, styles.entry ]}
						underlineColorAndroid="transparent"
					/>

					{this.state.imageData ?
						<ImageUploadContainer
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
							placeholder="And a short summary…"
							autoCapitalize="sentences"
							inputStyle={[ styles.threadSummary, styles.entry ]}
							underlineColorAndroid="transparent"
						/>
					}

					<CheckboxLabeled checked={this.state.shareOnFacebook} onPress={this._onSharePress.bind(this)}>
						Share this post on Facebook
					</CheckboxLabeled>
				</ScrollView>
				<View style={styles.footer}>
					<TouchFeedback
						borderless
						onPress={this._uploadImage.bind(this)}
					>
						<View style={styles.uploadButton}>
							<Icon
								name="image"
								style={[ styles.uploadButtonIcon, this.state.imageData ? styles.uploadButtonIconActive : null ]}
								size={24}
							/>
						</View>
					</TouchFeedback>
					<View style={[ styles.postButton, isDisabled ? styles.disabled : null ]}>
						{isDisabled ?
							<View style={styles.postButtonInner}>
								<AppText style={styles.postButtonText}>{isLoading ? "Posting…" : "Post"}</AppText>
							</View> :
							<TouchFeedback onPress={this._onPress.bind(this)}>
								<View style={styles.postButtonInner}>
									<AppText style={styles.postButtonText}>Post</AppText>
								</View>
							</TouchFeedback>
						}
					</View>
				</View>
			</StatusbarContainer>
		);
	}
}

StartDiscussionButton.propTypes = {
	room: React.PropTypes.string.isRequired,
	dismiss: React.PropTypes.func.isRequired,
	postDiscussion: React.PropTypes.func.isRequired,
	requestFacebookPermissions: React.PropTypes.func.isRequired,
	isFacebookPermissionGranted: React.PropTypes.func.isRequired,
	navigator: React.PropTypes.object.isRequired
};
