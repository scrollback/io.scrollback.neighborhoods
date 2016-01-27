import React from "react-native";
import Colors from "../../Colors.json";
import UserIconContainer from "../containers/UserIconContainer";
import AppbarTouchable from "./AppbarTouchable";

const {
	StyleSheet,
	NavigationActions
} = React;

const styles = StyleSheet.create({
	avatar: {
		borderColor: Colors.white,
		borderWidth: 1,
		margin: 16
	}
});

export default class AccountButton extends React.Component {
	_onPress = () => {
		this.props.onNavigation(NavigationActions.Push({ name: "account" }));
	};

	render() {
		return (
			<AppbarTouchable onPress={this._onPress}>
				<UserIconContainer
					style={styles.avatar}
					size={24}
				/>
			</AppbarTouchable>
		);
	}
}

AccountButton.propTypes = {
	onNavigation: React.PropTypes.func.isRequired
};
