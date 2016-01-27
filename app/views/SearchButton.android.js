/* @flow */

import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import AppbarSecondary from "./AppbarSecondary";
import AppbarIcon from "./AppbarIcon";
import Modal from "./Modal";
import LocalitiesFilterContainer from "../containers/LocalitiesFilteredContainer";

const {
	StyleSheet,
	TouchableHighlight,
	NavigationActions
} = React;

const styles = StyleSheet.create({
	searchbarText: {
		flex: 1,
		fontSize: 16,
		lineHeight: 24,
		marginHorizontal: 16
	},
	icon: {
		color: Colors.fadedBlack
	}
});

export default class SearchBar extends React.Component {
	static propTypes = {
		onNavigation: React.PropTypes.func.isRequired
	};

	shouldComponentUpdate() {
		return false;
	}

	_handleDismissModal = () => {
		Modal.renderComponent(null);
	};

	_handleSelectLocality = room => {
		this.props.onNavigation(NavigationActions.Push({
			name: "room",
			props: {
				room: room.id
			}
		}));
	};

	_handlePress = () => {
		Modal.renderComponent(<LocalitiesFilterContainer onDismiss={this._handleDismissModal} onSelectItem={this._handleSelectLocality} />);
	};

	render() {
		return (
			<TouchableHighlight underlayColor={Colors.underlay} onPress={this._handlePress}>
				<AppbarSecondary {...this.props}>
					<AppText style={styles.searchbarText}>Search for communties...</AppText>
					<AppbarIcon name="search" style={styles.icon} />
				</AppbarSecondary>
			</TouchableHighlight>
		);
	}
}
