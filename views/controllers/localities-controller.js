import React from "react-native";
import Localities from "../components/localities";
import store from "../../store/store";

const {
	InteractionManager
} = React;

export default class LocalitiesController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [ "LOADING" ]
		};
	}

	componentDidMount() {
		this._mounted = true;

		setTimeout(() => this._onDataArrived(store.getRelatedRooms()), 0);
	}

	componentWillUnmount() {
		this._mounted = false;
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
