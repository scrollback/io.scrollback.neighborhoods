import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import PageLoading from "./PageLoading";
import PageEmpty from "./PageEmpty";
import AvatarRound from "./AvatarRound";
import GrowingTextInput from "./GrowingTextInput";
import Modal from "./Modal";
import AccountPhotoChooser from "./AccountPhotoChooser";
import TouchFeedback from "./TouchFeedback";
import PushNotification from "../modules/PushNotification";
import routes from "../utils/routes";
import debounce from "../lib/debounce";

const {
	StyleSheet,
	ScrollView,
	View,
	PixelRatio,
	TouchableOpacity,
	SwitchAndroid: Switch
} = React;

const styles = StyleSheet.create({
	info: {
		flex: 1,
		marginLeft: 16
	},
	nick: {
		color: Colors.darkGrey,
		fontWeight: "bold"
	},
	email: {
		fontSize: 12,
		lineHeight: 18
	},
	settings: {
		alignItems: "stretch",
		backgroundColor: Colors.white
	},
	inputContainer: {
		borderColor: Colors.separator,
		borderBottomWidth: 1 / PixelRatio.get(),
		paddingVertical: 8
	},
	inputLabelText: {
		fontSize: 12,
		lineHeight: 18,
		marginHorizontal: 16
	},
	input: {
		marginHorizontal: 12
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: Colors.separator,
		borderBottomWidth: 1 / PixelRatio.get(),
		padding: 16
	},
	itemLabel: {
		flex: 1
	},
	itemText: {
		color: Colors.darkGrey
	},
	itemValueText: {
		fontSize: 12,
		lineHeight: 18
	},
	dropdown: {
		height: 24,
		width: 80
	}
});

export default class Account extends React.Component {
	constructor(props) {
		super(props);

		this._saveUserDebounced = debounce(this.props.saveUser, 1000);
		this._pushNotificationEnabledKey = "enabled";

		this.state = {
			pushNotificationEnabled: true
		};
	}

	componentWillMount() {
		this._updatePushNotificationValue();
	}

	async _updatePushNotificationValue() {
		let value = true;

		try {
			value = await PushNotification.getPreference(this._pushNotificationEnabledKey);
		} catch (e) {
			// Ignore
		}

		this.setState({
			pushNotificationEnabled: value !== "false"
		});
	}

	_onStatusChange(e) {
		const user = Object.assign({}, this.props.user);

		user.description = e.nativeEvent.text;

		this._saveUserDebounced(user);
	}

	_onPushNotificationChange(value) {
		PushNotification.setPreference(this._pushNotificationEnabledKey, value ? "true" : "false");

		this.setState({
			pushNotificationEnabled: value
		});
	}

	_onEmailNotificationChange(value) {
		const user = Object.assign({}, this.props.user);

		const params = user.params ? Object.assign({}, user.params) : {};
		const email = params.email ? Object.assign({}, params.email) : {};

		email.notifications = value;

		params.email = email;
		user.params = params;

		this.props.saveUser(user);
	}

	_onEmailFrequencyChange(value) {
		const user = Object.assign({}, this.props.user);

		const params = user.params ? Object.assign({}, user.params) : {};
		const email = params.email ? Object.assign({}, params.email) : {};

		email.frequency = value;

		params.email = email;
		user.params = params;

		this.props.saveUser(user);
	}

	_selectFrequency() {
		const options = [ "Daily", "Never" ];

		Modal.showActionSheetWithOptions({ options }, i =>
			this._onEmailFrequencyChange(options[i].toLowerCase())
		);
	}

	_signOut() {
		this.props.signOut();
	}

	_reportIssue() {
		this.props.navigator.push(routes.room({ room: "support" }));
	}

	_choosePhoto() {
		const photos = this.props.user.params.pictures;

		if (photos && photos.length > 2) {
			Modal.renderModal(
				<AccountPhotoChooser
					photos={photos}
					onSelect={uri => {
						const user = Object.assign({}, this.props.user);

						user.picture = uri;

						this.props.saveUser(user);

						Modal.renderComponent(null);
					}}
				/>
			);
		}
	}

	render() {
		const { user } = this.props;

		return (
			<View {...this.props}>
				{(() => {
					if (this.props.user === "missing") {
						return <PageLoading />;
					}

					if (this.props.user === "failed") {
						return <PageEmpty label="Failed to load account" image="sad" />;
					}

					return (
						<ScrollView contentContainerStyle={styles.settings}>
							<TouchableOpacity onPress={this._choosePhoto.bind(this)}>
								<View style={styles.item}>
									<AvatarRound
										size={48}
										nick={user.id}
									/>
									<View style={styles.info}>
										<AppText style={styles.nick}>{user.id}</AppText>
										<AppText style={styles.email}>{user.identities[0].slice(7)}</AppText>
									</View>
								</View>
							</TouchableOpacity>
							<View style={styles.inputContainer}>
								<AppText style={styles.inputLabelText}>Status message</AppText>
								<GrowingTextInput
									style={styles.input}
									defaultValue={user.description}
									placeholder="Status message"
									autoCapitalize="sentences"
									numberOfLines={3}
									onChange={this._onStatusChange.bind(this)}
								/>
							</View>
							<View style={styles.item}>
								<View style={styles.itemLabel}>
									<AppText style={styles.itemText}>Push notifications</AppText>
								</View>
								<Switch
									value={this.state.pushNotificationEnabled}
									onValueChange={this._onPushNotificationChange.bind(this)}
								/>
							</View>
							<View style={styles.item}>
								<View style={styles.itemLabel}>
									<AppText style={styles.itemText}>Mention notifications via email</AppText>
								</View>
								<Switch
									value={user.params && user.params.email ? user.params.email.notifications !== false : false}
									onValueChange={this._onEmailNotificationChange.bind(this)}
								/>
							</View>
							<TouchFeedback onPress={this._selectFrequency.bind(this)}>
								<View style={styles.item}>
									<View style={styles.itemLabel}>
										<AppText style={styles.itemText}>Email digest frequency</AppText>
										<AppText style={styles.itemValueText}>
											{user.params && user.params.email && user.params.email.frequency ?
												user.params.email.frequency.charAt(0).toUpperCase() + user.params.email.frequency.slice(1) :
												"Daily"
											}
										</AppText>
									</View>
								</View>
							</TouchFeedback>
							<TouchFeedback onPress={this._reportIssue.bind(this)}>
								<View style={styles.item}>
									<View style={styles.itemLabel}>
										<AppText style={styles.itemText}>Report an issue</AppText>
									</View>
								</View>
							</TouchFeedback>
							<TouchFeedback onPress={this._signOut.bind(this)}>
								<View style={styles.item}>
									<View style={styles.itemLabel}>
										<AppText style={styles.itemText}>Sign out</AppText>
									</View>
								</View>
							</TouchFeedback>
						</ScrollView>
					);
				})()}
			</View>
		);
	}
}

Account.propTypes = {
	user: React.PropTypes.oneOfType([
		React.PropTypes.oneOf([ "missing", "failed" ]),
		React.PropTypes.shape({
			id: React.PropTypes.string
		})
	]).isRequired,
	saveUser: React.PropTypes.func.isRequired,
	signOut: React.PropTypes.func.isRequired,
	navigator: React.PropTypes.object.isRequired
};
