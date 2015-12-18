import React from "react-native";
import Colors from "../../colors.json";
import UserIconContainer from "../containers/user-icon-container";
import AppbarTouchable from "./appbar-touchable";
import routes from "../utils/routes";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	avatar: {
		borderColor: Colors.white,
		borderWidth: 1,
		margin: 16
	}
});

export default class AccountButton extends React.Component {
	_onPress() {
		this.props.navigator.push(routes.account());
	}

	render() {
		return (
			<AppbarTouchable onPress={this._onPress.bind(this)}>
				<UserIconContainer
					style={styles.avatar}
					size={24}
				/>
			</AppbarTouchable>
		);
	}
}

AccountButton.propTypes = {
	navigator: React.PropTypes.object.isRequired
};
