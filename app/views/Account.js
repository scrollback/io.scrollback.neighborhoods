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
import debounce from "../lib/debounce";

const {
	StyleSheet,
	ScrollView,
	View,
	PixelRatio,
	TouchableOpacity,
	NavigationActions,
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

	_updatePushNotificationValue = async () => {
		let value = true;

		try {
			value = await PushNotification.getPreference(this._pushNotificationEnabledKey);
		} catch (e) {
			// Ignore
		}

		this.setState({
			pushNotificationEnabled: value !== "false"
		});
	};

	_handleStatusChange = text => {
		const user = Object.assign({}, this.props.user);

		user.description = text;

		this._saveUserDebounced(user);
	};

	_handlePushNotificationChange = value => {
		PushNotification.setPreference(this._pushNotificationEnabledKey, value ? "true" : "false");

		this.setState({
			pushNotificationEnabled: value
		});
	};

	_handleEmailNotificationChange = value => {
		const user = Object.assign({}, this.props.user);

		const params = user.params ? Object.assign({}, user.params) : {};
		const email = params.email ? Object.assign({}, params.email) : {};

		email.notifications = value;

		params.email = email;
		user.params = params;

		this.props.saveUser(user);
	};

	_handleEmailFrequencyChange = value => {
		const user = Object.assign({}, this.props.user);

		const params = user.params ? Object.assign({}, user.params) : {};
		const email = params.email ? Object.assign({}, params.email) : {};

		email.frequency = value;

		params.email = email;
		user.params = params;

		this.props.saveUser(user);
	};

	_handleSelectFrequency = () => {
		const options = [ "Daily", "Never" ];

		Modal.showActionSheetWithOptions({ options }, i =>
			this._handleEmailFrequencyChange(options[i].toLowerCase())
		);
	};

	_handleSignOut = () => {
		this.props.signOut();
	};

	_handleReportIssue = () => {
		this.props.onNavigation(new NavigationActions.Push({
			name: "room",
			props: {
				room: "support"
			}
		}));
	};

	_handlerSelectPhoto = uri => {
		const user = Object.assign({}, this.props.user);

		user.picture = uri;

		this.props.saveUser(user);

		Modal.renderComponent(null);
	};

	_handlePhotoChooser = () => {
		const photos = this.props.user.params.pictures;

		if (photos && photos.length > 2) {
			Modal.renderModal(
				<AccountPhotoChooser
					photos={photos}
					onSelect={this._handlerSelectPhoto}
				/>
			);
		}
	};

	render() {
		const { user } = this.props;

		if (user === "missing") {
			return <PageLoading />;
		}

		if (user === "failed") {
			return <PageEmpty label="Failed to load account" image="sad" />;
		}

		return (
			<ScrollView contentContainerStyle={styles.settings}>
				<TouchableOpacity onPress={this._handlePhotoChooser}>
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
						initialHeight={39}
						maxHeight={88}
						onChangeText={this._handleStatusChange}
					/>
				</View>
				<View style={styles.item}>
					<View style={styles.itemLabel}>
						<AppText style={styles.itemText}>Push notifications</AppText>
					</View>
					<Switch
						value={this.state.pushNotificationEnabled}
						onValueChange={this._handlePushNotificationChange}
					/>
				</View>
				<View style={styles.item}>
					<View style={styles.itemLabel}>
						<AppText style={styles.itemText}>Mention notifications via email</AppText>
					</View>
					<Switch
						value={user.params && user.params.email ? user.params.email.notifications !== false : false}
						onValueChange={this._handleEmailNotificationChange}
					/>
				</View>
				<TouchFeedback onPress={this._handleSelectFrequency}>
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
				<TouchFeedback onPress={this._handleReportIssue}>
					<View style={styles.item}>
						<View style={styles.itemLabel}>
							<AppText style={styles.itemText}>Report an issue</AppText>
						</View>
					</View>
				</TouchFeedback>
				<TouchFeedback onPress={this._handleSignOut}>
					<View style={styles.item}>
						<View style={styles.itemLabel}>
							<AppText style={styles.itemText}>Sign out</AppText>
						</View>
					</View>
				</TouchFeedback>
			</ScrollView>
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
	onNavigation: React.PropTypes.func.isRequired
};
