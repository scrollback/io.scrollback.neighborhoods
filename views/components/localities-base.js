import React from "react-native";
import RoomItemController from "../controllers/room-item-controller";
import PageFailed from "./page-failed";
import PageLoading from "./page-loading";
import geolocation from "../../modules/geolocation";

const {
	ListView,
	View
} = React;

export default class LocalitiesBase extends React.Component {
	constructor(props) {
		super(props);

		this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

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
		return this.dataSource.cloneWithRows(this.props.data);
	}

	render() {
		return (
			<View {...this.props}>
				{(() => {
					if (this.props.data.length === 0) {
						return <PageFailed pageLabel={this.props.pageEmptyLabel || "No places found"} />;
					}

					if (this.props.data.length === 1) {
						if (this.props.data[0] === "missing") {
							return <PageLoading />;
						}

						if (this.props.data[0] === "failed") {
							return <PageFailed pageLabel="Failed to load places" onRetry={this.props.refreshData} />;
						}
					}

					return (
						<ListView
							initialListSize={5}
							dataSource={this._getDataSource()}
							renderRow={room =>
								<RoomItemController
									key={room.id}
									room={room}
									showRoomMenu={this.props.showRoomMenu}
									position={this.state.position}
									navigator={this.props.navigator}
								/>
							}
						/>
					);
				})()}
			</View>
		);
	}
}

LocalitiesBase.propTypes = {
	data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
		React.PropTypes.oneOf([ "missing", "failed" ]),
		React.PropTypes.shape({
			id: React.PropTypes.string
		})
	])).isRequired,
	refreshData: React.PropTypes.func,
	showRoomMenu: React.PropTypes.bool,
	pageEmptyLabel: React.PropTypes.string,
	navigator: React.PropTypes.object.isRequired
};
