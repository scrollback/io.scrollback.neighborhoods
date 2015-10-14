/* global fetch */

import React from "react-native";
import FileUpload from "../../modules/file-upload";
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
			uploadId: null
		};
	}

	_pollThumbnail(opts) {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();

			let thumbTimer;

			const checkThumb = () => {
				if (thumbTimer) {
					clearTimeout(thumbTimer);
				}

				fetch(opts.thumbUrl)
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

			const formData = {};
			const fields = [
				"acl", "policy", "x-amz-algorithm", "x-amz-credential",
				"x-amz-date", "x-amz-signature"
			];

			for (let i = 0, l = fields.length; i < l; i++) {
				formData[fields[i]] = policy[fields[i]];
			}

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

			formData.key = key;
			formData.success_action_status = "201";

			return new Promise((resolve, reject) => {
				const uploadId = FileUpload.uploadFile(baseurl, this.props.imageData.uri, filename, formData, result => {
					if (result.type === "success") {
						resolve({
							responseBody: result.responseBody,
							thumbUrl: baseurl + policy.keyPrefix.replace(/^uploaded/, "generated") + thumbpath,
							originalUrl: url
						});
					} else {
						reject(new Error(result.message));
					}
				});

				this.setState({
					uploadId
				});
			});
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

			console.log(result);

			this.setState({
				status: FINISHED,
				uploadId: null
			});
		})
		.catch(err => {
			console.log(err);

			this.setState({
				status: ERROR,
				uploadId: null
			});

			if (this.props.onUploadError) {
				this.props.onUploadError(err);
			}
		});
	}

	_cancelUpload() {
		if (this.state.status === LOADING) {
			if (typeof this.state.uploadId === "number") {
				FileUpload.cancelUpload(this.state.uploadId);
			}

			this.setState({
				status: IDLE,
				uploadId: null
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
	onUploadFinish: React.PropTypes.func
};

ImageUploadController.defaultProps = {
	generateThumb: true,
	uploadType: "content"
};
