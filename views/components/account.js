import React from "react-native";
import PageLoading from "./page-loading";
import PageFailed from "./page-failed";
import AvatarController from "../controllers/avatar-controller";
import GrowingTextInput from "./growing-text-input";
import Modal from "./modal";
import TouchFeedback from "./touch-feedback";
import PushNotification from "../../modules/push-notification";
import routes from "../utils/routes";
import debounce from "../../lib/debounce";

const {
	StyleSheet,
	ScrollView,
	View,
	Text,
	SwitchAndroid,
	PixelRatio
} = React;

const styles = StyleSheet.create({
	avatar: {
		height: 48,
		width: 48,
		borderRadius: 24,
		backgroundColor: "rgba(0, 0, 0, .16)"
	},
	image: {
		flex: 1,
		resizeMode: "cover",
		borderRadius: 24
	},
	info: {
		flex: 1,
		marginLeft: 16
	},
	nick: {
		color: "#333",
		fontWeight: "bold",
		lineHeight: 21
	},
	email: {
		fontSize: 12,
		lineHeight: 18
	},
	settings: {
		alignItems: "stretch",
		backgroundColor: "#fff"
	},
	inputContainer: {
		borderColor: "rgba(0, 0, 0, .08)",
		borderBottomWidth: 1 / PixelRatio.get(),
		paddingVertical: 8
	},
	inputLabelText: {
		fontSize: 12,
		marginHorizontal: 16
	},
	input: {
		marginHorizontal: 12
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: "rgba(0, 0, 0, .08)",
		borderBottomWidth: 1 / PixelRatio.get(),
		padding: 16
	},
	itemLabel: {
		flex: 1
	},
	itemText: {
		color: "#333",
		fontSize: 14,
		lineHeight: 21
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

	render() {
		const { user } = this.props;

		return (
			<View {...this.props}>
				{(() => {
					if (this.props.user === "missing") {
						return <PageLoading />;
					}

					if (this.props.user === "failed") {
						return <PageFailed pageLabel="Failed to load account" />;
					}

					return (
						<ScrollView contentContainerStyle={styles.settings}>
							<View style={styles.item}>
								<View style={styles.avatar}>
									<AvatarController
										size={48}
										nick={user.id}
										style={styles.image}
									/>
								</View>
								<View style={styles.info}>
									<Text style={styles.nick}>{user.id}</Text>
									<Text style={styles.email}>{user.identities[0].slice(7)}</Text>
								</View>
							</View>
							<View style={styles.inputContainer}>
								<Text style={styles.inputLabelText}>Status message</Text>
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
									<Text style={styles.itemText}>Push notifications</Text>
								</View>
								<SwitchAndroid
									value={this.state.pushNotificationEnabled}
									onValueChange={this._onPushNotificationChange.bind(this)}
								/>
							</View>
							<View style={styles.item}>
								<View style={styles.itemLabel}>
									<Text style={styles.itemText}>Mention notifications via email</Text>
								</View>
								<SwitchAndroid
									value={user.params && user.params.email ? user.params.email.notifications !== false : false}
									onValueChange={this._onEmailNotificationChange.bind(this)}
								/>
							</View>
							<TouchFeedback onPress={this._selectFrequency.bind(this)}>
								<View style={styles.item}>
									<View style={styles.itemLabel}>
										<Text style={styles.itemText}>Email digest frequency</Text>
										<Text style={styles.itemValueText}>
											{user.params && user.params.email && user.params.email.frequency ?
												user.params.email.frequency.charAt(0).toUpperCase() + user.params.email.frequency.slice(1) :
												"Daily"
											}
										</Text>
									</View>
								</View>
							</TouchFeedback>
							<TouchFeedback onPress={this._reportIssue.bind(this)}>
								<View style={styles.item}>
									<View style={styles.itemLabel}>
										<Text style={styles.itemText}>Report an issue</Text>
									</View>
								</View>
							</TouchFeedback>
							<TouchFeedback onPress={this._signOut.bind(this)}>
								<View style={styles.item}>
									<View style={styles.itemLabel}>
										<Text style={styles.itemText}>Sign out</Text>
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
