import React from "react-native";

const {
	Dimensions,
	Image
} = React;

export default class EmbedImage extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.height !== nextProps.height ||
			this.props.width !== nextProps.width ||
			this.props.uri !== nextProps.uri
		);
	}

	render() {
		const {
			height,
			width,
			uri
		} = this.props;

		const win = Dimensions.get("window");
		const ratio = (height && width) ? (height / width) : 1;

		// Determine the optimal height and width
		const displayWidth = (height ? Math.min(width, win.width - 120) : 160);
		const displayHeight = displayWidth * ratio;

		return (
			<Image
				style={[ {
					height: displayHeight,
					width: displayWidth
				}, this.props.style ]}
				source={{ uri }}
			/>
		);
	}
}

EmbedImage.propTypes = {
	height: React.PropTypes.number,
	width: React.PropTypes.number,
	uri: React.PropTypes.string.isRequired
};
