import React from "react-native";
import EvilIcons from "react-native-vector-icons/EvilIcons";
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
import ImageUploadDiscussion from "./ImageUploadDiscussion";
import ImageChooser from "../modules/ImageChooser";
import textUtils from "../lib/text-utils";

const {
	AsyncStorage,
	TouchableOpacity,
	StyleSheet,
	NavigationActions,
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
	},
	socialItem: {
		flexDirection: "row",
		alignItems: "center"
	},
	socialIconContainer: {
		height: 24,
		width: 24,
		marginHorizontal: 12,
		marginVertical: 8,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.grey,
		borderRadius: 2
	},
	socialIconContainerSelected: {
		backgroundColor: Colors.facebook
	},
	socialIcon: {
		fontSize: 24,
		borderRadius: 12,
		color: Colors.white
	},
	socialTextSelected: {
		color: Colors.facebook,
		fontWeight: "bold"
	},
	socialTip: {
		margin: 12,
		fontSize: 12,
		color: Colors.grey
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

	_onSharePress = () => {
		requestAnimationFrame(async () => {
			let shareOnFacebook = !this.state.shareOnFacebook;

			if (shareOnFacebook) {
				try {
					await this.props.requestFacebookPermissions();
				} catch (err) {
					shareOnFacebook = false;
				}
			}

			this.setState({
				shareOnFacebook
			});

			AsyncStorage.setItem(FACEBOOK_SHARE_CHECKED_KEY, JSON.stringify(shareOnFacebook));
		});
	};

	_setShareCheckbox = async () => {
		let shareOnFacebook;

		try {
			const isEnabled = JSON.parse(await AsyncStorage.getItem(FACEBOOK_SHARE_CHECKED_KEY));

			if (isEnabled) {
				const granted = await this.props.isFacebookPermissionGranted();

				shareOnFacebook = granted;
			} else {
				shareOnFacebook = false;
			}
		} catch (err) {
			shareOnFacebook = false;
		}

		this.setState({
			shareOnFacebook
		});
	};

	_onLoading = () => {
		this.setState({
			status: "loading"
		});
	};

	_onPosted = thread => {
		this.props.onNavigation(new NavigationActions.Push({
			name: "chat",
			props: {
				thread: thread.id,
				room: this.props.room
			}
		}));
	};

	_onError = message => {
		this.setState({
			error: message,
			status: null
		});
	};

	_postDiscussion = async () => {
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
	};

	_onPress = () => {
		if (this.state.status === "loading") {
			return;
		}

		this._postDiscussion();
	};

	_onTitleChange = e => {
		this.setState({
			title: e.nativeEvent.text,
			error: null
		});
	};

	_onTextChange = e => {
		this.setState({
			text: e.nativeEvent.text,
			error: null
		});
	};

	_uploadImage = async () => {
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
	};

	_onUploadFinish = result => {
		this.setState({
			uploadResult: result,
			error: null
		});
	};

	_onUploadClose = () => {
		this.setState({
			imageData: null,
			uploadResult: null,
			error: null
		});
	};

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
						onChange={this._onTitleChange}
						placeholder="Write a discussion title"
						autoCapitalize="sentences"
						style={[ styles.threadTitle, styles.entry ]}
						underlineColorAndroid="transparent"
					/>

					{this.state.imageData ?
						<ImageUploadContainer
							component={ImageUploadDiscussion}
							imageData={this.state.imageData}
							onUploadClose={this._onUploadClose}
							onUploadFinish={this._onUploadFinish}
							autoStart
						/> :
						<GrowingTextInput
							numberOfLines={5}
							value={this.state.text}
							onChange={this._onTextChange}
							placeholder="And a short summary…"
							autoCapitalize="sentences"
							inputStyle={[ styles.threadSummary, styles.entry ]}
							underlineColorAndroid="transparent"
						/>
					}

					<TouchableOpacity onPress={this._onSharePress}>
						<View style={styles.socialItem}>
							<View style={[ styles.socialIconContainer, this.state.shareOnFacebook ? styles.socialIconContainerSelected : null ]}>
								<EvilIcons name="sc-facebook" style={styles.socialIcon} />
							</View>
							<AppText style={[ styles.socialText, this.state.shareOnFacebook ? styles.socialTextSelected : null ]}>
								{this.state.shareOnFacebook ?
									"This will appear on your timeline" :
									"Tap to share this with your friends"
								}
							</AppText>
						</View>
					</TouchableOpacity>
					<AppText style={styles.socialTip}>Tip: Sharing improves your discussion’s reach</AppText>
				</ScrollView>
				<View style={styles.footer}>
					<TouchFeedback
						borderless
						onPress={this._uploadImage}
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
							<TouchFeedback onPress={this._onPress}>
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
	onNavigation: React.PropTypes.func.isRequired
};
