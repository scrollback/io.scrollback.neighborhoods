import React from "react-native";
import Colors from "../../colors.json";
import AppbarTouchable from "./appbar-touchable";
import AvatarRound from "./avatar-round";
import routes from "../utils/routes";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	avatar: {
		borderColor: Colors.white,
		borderWidth: 1,
		margin: 15
	}
});

export default class UserIcon extends React.Component {
	shouldComponentUpdate(nextProps) {
		return this.props.nick !== nextProps.nick;
	}

	_onPress() {
		this.props.navigator.push(routes.account());
	}

	render() {
		return (
			<AppbarTouchable onPress={this._onPress.bind(this)}>
				<AvatarRound
					style={styles.avatar}
					size={24}
					nick={this.props.nick}
				/>
			</AppbarTouchable>
		);
	}
}

UserIcon.propTypes = {
	nick: React.PropTypes.string.isRequired,
	navigator: React.PropTypes.object.isRequired
};
