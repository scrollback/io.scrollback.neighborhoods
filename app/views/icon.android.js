import React from "react-native";
import { Icon as FontIcon } from "react-native-icons";

export default class Icon extends React.Component {
	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		const { size } = this.props;

		return (
			<FontIcon
				{...this.props}
				style={[ { height: size, width: size }, this.props.style ]}
				name={"material|" + this.props.name}
				ref={c => this._root = c}
			/>
		);
	}
}

Icon.propTypes = {
	size: React.PropTypes.number.isRequired,
	name: React.PropTypes.string.isRequired
};
