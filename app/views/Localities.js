import React from "react-native";
import BannerUnavailable from "./BannerUnavailable";
import PageEmpty from "./PageEmpty";
import PageLoading from "./PageLoading";
import LoadingItem from "./LoadingItem";
import BannerOfflineContainer from "../containers/BannerOfflineContainer";
import LocalityItem from "./LocalityItem";
import Geolocation from "../modules/Geolocation";

const {
	StyleSheet,
	View,
	NavigationActions,
	ListView,
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
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

	render() {
		let placeHolder;

		if (this.props.data.length === 0) {
			placeHolder = <PageEmpty label="You've not joined any communities" image="meh" />;
		} else if (this.props.data.length === 1) {
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
					/>
				}
			</View>
		);
	}
}
