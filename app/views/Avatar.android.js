import React from "react-native";
import URLResolver from "../modules/URLResolver";

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

		if (this.props.uri) {
			this._updateData(this.props.uri);
		}
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.uri !== nextProps.uri) {
			this._updateData(nextProps.uri);
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (this.state.uri !== nextState.uri);
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	_updateData = async currentUri => {
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
	};

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
