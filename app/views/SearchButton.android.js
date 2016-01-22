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

	_dismissModal = () => {
		Modal.renderComponent(null);
	};

	_onSelectLocality = room => {
		this.props.onNavigation(new NavigationActions.Push({
			name: "room",
			props: {
				room: room.id
			}
		}));
	};

	_onPress = () => {
		Modal.renderComponent(<LocalitiesFilterContainer onDismiss={this._dismissModal} onSelectLocality={this._onSelectLocality} />);
	};

	render() {
		return (
			<TouchableHighlight underlayColor={Colors.underlay} onPress={this._onPress}>
				<AppbarSecondary {...this.props}>
					<AppText style={styles.searchbarText}>Search for communties...</AppText>
					<AppbarIcon name="search" style={styles.icon} />
				</AppbarSecondary>
			</TouchableHighlight>
		);
	}
}
