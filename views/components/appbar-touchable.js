import React from "react-native";
import TouchFeedback from "./touch-feedback";

const {
	View
} = React;

export default class AppbarTouchable extends React.Component {
	_onPress() {
		global.requestAnimationFrame(() => this.props.onPress());
	}

	render() {
		return (
			<TouchFeedback
				{...this.props}
				onPress={this._onPress.bind(this)}
				delayPressIn={0}
			>
				<View>
					{this.props.children}
				</View>
			</TouchFeedback>
		);
	}
}

AppbarTouchable.propTypes = {
	onPress: React.PropTypes.func.isRequired,
	children: React.PropTypes.node.isRequired
};
