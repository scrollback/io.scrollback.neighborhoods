import React from "react-native";
import SearchButton from "./SearchButton";
import BannerUnavailable from "./BannerUnavailable";
import PageEmpty from "./PageEmpty";
import PageLoading from "./PageLoading";
import LoadingItem from "./LoadingItem";
import ListHeader from "./ListHeader";
import BannerOfflineContainer from "../containers/BannerOfflineContainer";
import LocalityItemContainer from "../containers/LocalityItemContainer";
import Geolocation from "../modules/Geolocation";
import config from "../store/config";

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
		data: React.PropTypes.objectOf(React.PropTypes.arrayOf(React.PropTypes.oneOfType([
			React.PropTypes.oneOf([ "missing", "failed" ]),
			React.PropTypes.shape({
				id: React.PropTypes.string
			})
		]))).isRequired,
	};

	state = {
		location: null
	};

	_dataSource = new ListView.DataSource({
		rowHasChanged: (r1, r2) => r1 !== r2,
		sectionHeaderHasChanged: (h1, h2) => h1 !== h2
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
		return this._dataSource.cloneWithRowsAndSections(this.props.data);
	};

	_onSelectLocality = room => {
		this.props.onNavigation(NavigationActions.Push({
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
			<LocalityItemContainer
				key={room.id}
				room={room}
				location={this.state.location}
				onSelect={this._onSelectLocality}
				showMenuButton
				showBadge
			/>
		);
	};

	_renderSectionHeader = (sectionData, sectionID) => {
		let header;

		switch (sectionID) {
		case "following":
			header = "My communities";
			break;
		case "nearby":
			header = "Communities nearby";
			break;
		case "results":
			const count = sectionData.length;

			header = count + " result" + (count > 1 ? "s" : "") + " found";
			break;
		}

		return <ListHeader>{header}</ListHeader>;
	};

	render() {
		let placeHolder;

		const { data } = this.props;
		const keys = Object.keys(data);

		if (keys.length === 0 || keys.every(item => data[item].length === 0)) {
			placeHolder = <PageEmpty label="You've not joined any communities" image="meh" />;
		} else if (keys.every(item => data[item].length === 0 || data[item][0] === "missing") && keys.some(item => data[item][0] === "missing")) {
			placeHolder = <PageLoading />;
		} else if (keys.every(item => data[item].length === 1 && data[item][0] === "failed")) {
			placeHolder = <PageEmpty label="Failed to load communities" image="sad" />;
		} else if (keys.some(item => data[item].length === 1 && data[item][0] === "unavailable")) {
			placeHolder = <PageEmpty label={config.app_name + " is not available in your neighborhood yet."} image="sad" />;
		} else {
			placeHolder = (
				<ListView
					keyboardShouldPersistTaps
					dataSource={this._getDataSource()}
					renderRow={this._renderRow}
					renderSectionHeader={this._renderSectionHeader}
				/>
			);
		}

		return (
			<View style={styles.container}>
				<BannerOfflineContainer />
				{this.props.available === false ?
					<BannerUnavailable /> :
					<SearchButton onNavigation={this.props.onNavigation} />}
				{placeHolder}
			</View>
		);
	}
}
