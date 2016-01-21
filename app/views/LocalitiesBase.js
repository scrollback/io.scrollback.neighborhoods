import React from "react-native";
import LocalityItemContainer from "../containers/LocalityItemContainer";
import PageEmpty from "./PageEmpty";
import PageLoading from "./PageLoading";
import LoadingItem from "./LoadingItem";
import ListHeader from "./ListHeader";
import Geolocation from "../modules/Geolocation";
import config from "../store/config";

const {
	ListView,
	View
} = React;

export default class LocalitiesBase extends React.Component {
	constructor(props) {
		super(props);

		this._dataSource = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (h1, h2) => h1 !== h2
		});

		this.state = {
			location: null
		};
	}

	componentDidMount() {
		this._mounted = true;

		this._setCurrentPosition();
		this._watchPosition();
	}

	componentWillUnmount() {
		this._mounted = false;

		this._clearWatch();
	}

	_watchPosition = () => {
		this._watchID = Geolocation.watchPosition(location => {
			if (this._mounted) {
				this.setState({ location });
			}
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

			if (this._mounted) {
				this.setState({
					location
				});
			}
		} catch (e) {
			// Ignore
		}
	};

	_getDataSource = () => {
		return this._dataSource.cloneWithRowsAndSections(this.props.data);
	};

	render() {
		return (
			<View {...this.props}>
				{(() => {
					const { data } = this.props;
					const keys = Object.keys(data);

					if (keys.length === 0 || keys.every(item => data[item].length === 0)) {
						return <PageEmpty label={this.props.pageEmptyLabel} image={this.props.pageEmptyImage} />;
					}

					if (keys.every(item => data[item].length === 0 || data[item][0] === "missing") && keys.some(item => data[item][0] === "missing")) {
						return <PageLoading />;
					}

					if (keys.every(item => data[item].length === 1 && data[item][0] === "failed")) {
						return <PageEmpty label="Failed to load communities" image="sad" />;
					}

					if (keys.some(item => data[item].length === 1 && data[item][0] === "unavailable")) {
						return <PageEmpty label={config.app_name + " is not available in your neighborhood yet."} image="sad" />;
					}

					return (
						<ListView
							keyboardShouldPersistTaps
							initialListSize={1}
							dataSource={this._getDataSource()}
							renderRow={room => {
								if (room === "missing") {
									return <LoadingItem />;
								}

								return (
									<LocalityItemContainer
										key={room.id}
										room={room}
										showMenuButton={this.props.showMenuButton}
										showBadge={this.props.showBadge}
										location={this.state.location}
										onNavigation={this.props.onNavigation}
										onSelect={this.props.onSelectLocality}
									/>
								);
							}}
							renderSectionHeader={(sectionData, sectionID) => {
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
							}}
						/>
					);
				})()}
			</View>
		);
	}
}

LocalitiesBase.propTypes = {
	data: React.PropTypes.objectOf(React.PropTypes.arrayOf(React.PropTypes.oneOfType([
		React.PropTypes.oneOf([ "missing", "failed" ]),
		React.PropTypes.shape({
			id: React.PropTypes.string
		})
	]))).isRequired,
	refreshData: React.PropTypes.func,
	showMenuButton: React.PropTypes.bool,
	showBadge: React.PropTypes.bool,
	pageEmptyLabel: React.PropTypes.string.isRequired,
	pageEmptyImage: React.PropTypes.string.isRequired,
	onNavigation: React.PropTypes.func.isRequired,
	onSelectLocality: React.PropTypes.func,
};
