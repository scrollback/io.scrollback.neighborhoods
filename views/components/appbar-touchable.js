import React from "react-native";

const {
	TouchableHighlight,
	View
} = React;

export default class AppbarTouchable extends React.Component {
	_onPress() {
		global.requestAnimationFrame(() => this.props.onPress());
	}

	render() {
		return (
			<TouchableHighlight
				{...this.props}
				underlayColor="rgba(0, 0, 0, .16)"
				onPress={this._onPress.bind(this)}
			>
				<View>
					{this.props.children}
				</View>
			</TouchableHighlight>
		);
	}
}

AppbarTouchable.propTypes = {
	onPress: React.PropTypes.func.isRequired,
	children: React.PropTypes.element
};
