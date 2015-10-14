import React from "react-native";
import controller from "./controller";

const IDLE = "idle";
const LOADING = "loading";
const FINISHED = "finished";
const ERROR = "error";

@controller
export default class ImageUploadController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			status: IDLE
		};
	}

	_startUpload() {
		if (this.state.status === IDLE) {
			this.setState({
				status: LOADING
			});

			if (this.props.onUploadStart) {
				this.props.onUploadStart();
			}
		}
	}

	_cancelUpload() {
		if (this.state.status === LOADING) {
			this.setState({
				status: IDLE
			});
		}
	}

	_closeUpload() {
		if (this.props.onUploadClose) {
			this.props.onUploadClose();
		}
	}

	render() {
		return (
			<this.props.component
				imageData={this.props.imageData}
				status={this.state.status}
				startUpload={this._startUpload.bind(this)}
				cancelUpload={this._cancelUpload.bind(this)}
				closeUpload={this._closeUpload.bind(this)}
			/>
		);
	}
}

ImageUploadController.propTypes = {
	component: React.PropTypes.element.isRequired,
	imageData: React.PropTypes.shape({
		name: React.PropTypes.string.isRequired,
		uri: React.PropTypes.string.isRequired,
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		size: React.PropTypes.number.isRequired
	}).isRequired,
	onUploadStart: React.PropTypes.func,
	onUploadCancel: React.PropTypes.func,
	onUploadClose: React.PropTypes.func,
	onUploadError: React.PropTypes.func
};
