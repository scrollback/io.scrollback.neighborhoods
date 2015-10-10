import React from "react-native";
import Localities from "../components/localities";
import controller from "./controller";

const {
	InteractionManager
} = React;

@controller
export default class LocalitiesController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "LOADING" ]
		};
	}

	componentDidMount() {
		setTimeout(() => this._onDataArrived(this.store.getRelatedRooms()), 0);
	}

	_onDataArrived(data) {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({ data });
			}
		});
	}

	_onError() {
		InteractionManager.runAfterInteractions(() => {
			if (this._mounted) {
				this.setState({
					data: [ "FAILED" ]
				});
			}
		});
	}

	_refreshData() {

	}

	render() {
		return (
			<Localities
				{...this.props}
				{...this.state}
				refreshData={this._refreshData.bind(this)}
			/>
		);
	}
}

LocalitiesController.propTypes = {
	filter: React.PropTypes.string
};
