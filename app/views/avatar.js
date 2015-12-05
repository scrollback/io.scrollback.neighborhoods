import React from "react-native";
import URLResolver from "../../modules/url-resolver";

const {
	Image
} = React;

export default class Avatar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			uri: ""
		};
	}

	componentWillMount() {
		this._mounted = true;

		this._updateData(this.props.uri);
	}

	componentWillReceiveProps(nextProps) {
		this._updateData(nextProps.uri);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (this.state.uri !== nextState.uri);
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	async _updateData(currentUri) {
		try {
			// We manually resolve the links since RN doesn't seem to handle redirects properly
			const uri = await URLResolver.resolveURL(currentUri);

			if (this._mounted) {
				this.setState({
					uri
				});
			}
		} catch (e) {
			this.setState({
				uri: currentUri
			});
		}
	}

	render() {
		if (this.state.uri) {
			return (
				<Image
					{...this.props}
					source={{ uri: this.state.uri }}
				/>
			);
		} else {
			return null;
		}
	}
}

Avatar.propTypes = {
	uri: React.PropTypes.string.isRequired,
	size: React.PropTypes.number.isRequired
};
