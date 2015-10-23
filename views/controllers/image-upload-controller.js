/* eslint-env browser */

import React from "react-native";
import controller from "./controller";
import generate from "../../lib/generate.browser";

const IDLE = "idle";
const LOADING = "loading";
const FINISHED = "finished";
const ERROR = "error";

@controller
export default class ImageUploadController extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			status: IDLE,
			request: null
		};
	}

	componentWillMount() {
		if (this.props.autoStart) {
			this._startUpload();
		}
	}

	componentWillUnmount() {
		this._closeUpload();
	}

	_pollThumbnail(opts) {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();

			let thumbTimer;

			const checkThumb = () => {
				if (thumbTimer) {
					clearTimeout(thumbTimer);
				}

				fetch(opts.thumbnailUrl)
					.then(() => resolve(opts))
					.catch(() => {
						if (Date.now() - startTime > 30000) {
							reject(new Error("Thumbnail generation timed out!"));
						} else {
							thumbTimer = setTimeout(checkThumb, 1500);
						}
					});
			};

			setTimeout(checkThumb, 3000);
		});
	}

	_startUpload() {
		if (this.state.status !== IDLE && this.state.status !== ERROR) {
			return;
		}

		this.setState({
			status: LOADING
		});

		if (this.props.onUploadStart) {
			this.props.onUploadStart();
		}

		const textId = generate.uid();

		this.query("upload/getPolicy", {
			uploadType: this.props.uploadType,
			userId: this.store.get("user"),
			textId
		})
		.then(res => {
			const policy = res.response;

			const baseurl = "https://" + policy.bucket + ".s3.amazonaws.com/";
			const filename = this.props.imageData.name.replace(/\s+/g, " ");

			let key = policy.keyPrefix,
				url, thumbpath;

			switch (this.props.uploadType) {
			case "avatar":
			case "banner":
				thumbpath = "256x256.jpg";
				key += "original." + filename.split(".").pop();
				url = baseurl + key;
				break;
			case "content":
				thumbpath = "1/480x960.jpg";
				key += "1/" + filename;
				url = baseurl + policy.keyPrefix + "1/" + encodeURIComponent(filename);
				break;
			}

			const formData = new FormData();

			const fields = [
				"acl", "policy", "x-amz-algorithm", "x-amz-credential",
				"x-amz-date", "x-amz-signature"
			];

			for (let i = 0, l = fields.length; i < l; i++) {
				formData.append(fields[i], policy[fields[i]]);
			}

			formData.append("key", key);
			formData.append("success_action_status", "201");

			const { uri, name } = this.props.imageData;
			const type = "image/" + (name.split(".").pop() || "jpg");

			formData.append("file", { uri, type });

			return fetch(baseurl, {
				method: "POST",
				body: formData
			}).then(() => ({
				textId,
				thumbnailUrl: baseurl + policy.keyPrefix.replace(/^uploaded/, "generated") + thumbpath,
				originalUrl: url
			}));
		})
		.then(opts => {
			if (this.props.generateThumb) {
				return this._pollThumbnail(opts);
			} else {
				return opts;
			}
		})
		.then(result => {
			if (this.props.onUploadFinish) {
				this.props.onUploadFinish(result);
			}

			this.setState({
				status: FINISHED,
				request: null
			});
		})
		.catch(err => {
			this.setState({
				status: ERROR,
				request: null
			});

			if (this.props.onUploadError) {
				this.props.onUploadError(err);
			}
		});
	}

	_cancelUpload() {
		if (this.state.status === LOADING) {
			if (this.state.request) {
				this.state.request.abort();
			}

			this.setState({
				status: IDLE,
				request: null
			});
		}
	}

	_closeUpload() {
		this._cancelUpload();

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
	component: React.PropTypes.any.isRequired,
	imageData: React.PropTypes.shape({
		name: React.PropTypes.string.isRequired,
		uri: React.PropTypes.string.isRequired,
		height: React.PropTypes.number.isRequired,
		width: React.PropTypes.number.isRequired,
		size: React.PropTypes.number.isRequired
	}).isRequired,
	generateThumb: React.PropTypes.bool,
	uploadType: React.PropTypes.string,
	onUploadStart: React.PropTypes.func,
	onUploadCancel: React.PropTypes.func,
	onUploadClose: React.PropTypes.func,
	onUploadError: React.PropTypes.func,
	onUploadFinish: React.PropTypes.func,
	autoStart: React.PropTypes.bool
};

ImageUploadController.defaultProps = {
	generateThumb: true,
	uploadType: "content"
};
