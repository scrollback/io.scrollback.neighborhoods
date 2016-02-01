import React from "react-native";
import BannerUnavailable from "./BannerUnavailable";
import PageEmpty from "./PageEmpty";
import PageLoading from "./PageLoading";
import LoadingItem from "./LoadingItem";
import BannerOfflineContainer from "../containers/BannerOfflineContainer";
import LocalityItem from "./LocalityItem";
import ListItem from "./ListItem";
import AppText from "./AppText";
import Icon from "./Icon";
import Geolocation from "../modules/Geolocation";
import Colors from "../../Colors.json";

const {
	StyleSheet,
	View,
	NavigationActions,
	ListView,
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},

	footer: {
		marginTop: 8,
	},

	footerItem: {
		height: 48,
	},

	footerLabel: {
		fontSize: 12,
		lineHeight: 18,
		fontWeight: "bold",
		color: Colors.fadedBlack,
	},

	footerIcon: {
		color: Colors.fadedBlack,
		marginHorizontal: 16
	},
});

export default class Localities extends React.Component {
	static propTypes = {
		available: React.PropTypes.bool,
		onNavigation: React.PropTypes.func.isRequired,
		data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
			React.PropTypes.oneOf([ "missing", "failed" ]),
			React.PropTypes.shape({
				id: React.PropTypes.string
			})
		])).isRequired,
	};

	state = {
		location: null
	};

	_dataSource = new ListView.DataSource({
		rowHasChanged: (r1, r2) => r1 !== r2
	});

	componentDidMount() {
		this._setCurrentPosition();
		this._watchPosition();
	}

	componentWillUnmount() {
		this._clearWatch();
	}

	_watchPosition = () => {
		this._watchID = Geolocation.watchPosition(location => {
			this.setState({ location });
		});
	};

	_clearWatch = () => {
		if (this._watchID) {
			Geolocation.clearWatch(this._watchID);
		}
	};

	_setCurrentPosition = async () => {
		try {
			const location = await Geolocation.getCurrentPosition();

			this.setState({
				location
			});
		} catch (e) {
			// Ignore
		}
	};

	_getDataSource = () => {
		return this._dataSource.cloneWithRows(this.props.data);
	};

	_handleSelectLocality = room => {
		this.props.onNavigation(new NavigationActions.Push({
			name: "room",
			props: {
				room: room.id
			}
		}));
	};

	_renderRow = room => {
		if (room === "missing") {
			return <LoadingItem />;
		}

		return (
			<LocalityItem
				key={room.id}
				room={room}
				location={this.state.location}
				onSelect={this._handleSelectLocality}
				showMenuButton
				showBadge
			/>
		);
	};

	_handleManagePlaces = () => {
		this.props.onNavigation(new NavigationActions.Push({
			name: "places",
		}));
	};

	_handleReportIssue = () => {
		this.props.onNavigation(new NavigationActions.Push({
			name: "room",
			props: {
				room: "support"
			}
		}));
	};

	_renderFooter = () => {
		return (
			<View style={styles.footer}>
				<ListItem containerStyle={styles.footerItem} onPress={this._handleManagePlaces}>
					<Icon
						style={styles.footerIcon}
						name="settings"
						size={18}
					/>
					<AppText style={styles.footerLabel}>MANAGE MY PLACES</AppText>
				</ListItem>
				<ListItem containerStyle={styles.footerItem} onPress={this._handleReportIssue}>
					<Icon
						style={styles.footerIcon}
						name="info"
						size={18}
					/>
					<AppText style={styles.footerLabel}>REPORT AN ISSUE</AppText>
				</ListItem>
			</View>
		);
	};

	render() {
		let placeHolder;

		if (this.props.data.length === 1) {
			switch (this.props.data[0]) {
			case "missing":
				placeHolder = <PageLoading />;
				break;
			case "failed":
				placeHolder = <PageEmpty label="Failed to load discussions" image="sad" />;
				break;
			}
		}

		return (
			<View style={styles.container}>
				<BannerOfflineContainer />
				{this.props.available === false ?
					<BannerUnavailable /> :
					null
				}

				{placeHolder ? placeHolder :
					<ListView
						keyboardShouldPersistTaps
						dataSource={this._getDataSource()}
						renderRow={this._renderRow}
						renderFooter={this._renderFooter}
					/>
				}
			</View>
		);
	}
}
