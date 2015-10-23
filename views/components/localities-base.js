import React from "react-native";
import RoomItemController from "../controllers/room-item-controller";
import PageFailed from "./page-failed";
import PageLoading from "./page-loading";
import LoadingItem from "./loading-item";
import geolocation from "../../modules/geolocation";

const {
	StyleSheet,
	PixelRatio,
	ListView,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	header: {
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderColor: "rgba(0, 0, 0, .08)",
		borderBottomWidth: 1 / PixelRatio.get()
	},
	headerText: {
		color: "#000",
		fontSize: 12,
		fontWeight: "bold",
		opacity: 0.5
	}
});

export default class LocalitiesBase extends React.Component {
	constructor(props) {
		super(props);

		this.dataSource = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2,
			sectionHeaderHasChanged: (h1, h2) => h1 !== h2
		});

		this.state = {
			position: null
		};
	}

	componentWillMount() {
		geolocation.getCurrentPosition(position => this.setState({ position }));

		this._watchID = geolocation.watchPosition(position => {
			if (this._mounted) {
				this.setState({ position });
			}
		});
	}

	componentDidMount() {
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;

		if (this._watchID) {
			geolocation.clearWatch(this._watchID);
		}
	}

	_getDataSource() {
		return this.dataSource.cloneWithRowsAndSections(this.props.data);
	}

	render() {
		return (
			<View {...this.props}>
				{(() => {
					const { data } = this.props;
					const keys = Object.keys(data);

					if (keys.length === 0 || keys.every(item => data[item].length === 0)) {
						return <PageFailed pageLabel={this.props.pageEmptyLabel} />;
					}

					if (keys.every(item => data[item].length === 1)) {
						if (keys.every(item => data[item][0] === "missing")) {
							return <PageLoading />;
						}

						if (keys.every(item => data[item][0] === "failed")) {
							return <PageFailed pageLabel="Failed to load communities" onRetry={this.props.refreshData} />;
						}
					}

					return (
						<ListView
							initialListSize={5}
							dataSource={this._getDataSource()}
							renderRow={room => {
								if (room === "missing") {
									return <LoadingItem />;
								}

								return (
									<RoomItemController
										key={room.id}
										room={room}
										showRoomMenu={this.props.showRoomMenu}
										position={this.state.position}
										navigator={this.props.navigator}
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

								return (
									<View style={styles.header}>
										<Text style={styles.headerText}>{header.toUpperCase()}</Text>
									</View>
								);
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
	showRoomMenu: React.PropTypes.bool,
	pageEmptyLabel: React.PropTypes.string.isRequired,
	navigator: React.PropTypes.object.isRequired
};
