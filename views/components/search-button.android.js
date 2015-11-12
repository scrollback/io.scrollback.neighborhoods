import React from "react-native";
import Colors from "../../colors.json";
import AppbarSecondary from "./appbar-secondary";
import AppbarIcon from "./appbar-icon";
import Modal from "./modal";
import LocalitiesFilterController from "../controllers/localities-filtered-controller";

const {
	StyleSheet,
	TouchableHighlight,
	Text
} = React;

const styles = StyleSheet.create({
	searchbarText: {
		flex: 1,
		fontSize: 16,
		marginHorizontal: 16
	},
	icon: {
		color: Colors.fadedBlack
	}
});

export default class SearchBar extends React.Component {
	shouldComponentUpdate() {
		return false;
	}

	_onPress() {
		Modal.renderComponent(<LocalitiesFilterController dismiss={() => Modal.renderComponent(null)} navigator={this.props.navigator} />);
	}

	render() {
		return (
			<TouchableHighlight underlayColor="rgba(0, 0, 0, .16)" onPress={this._onPress.bind(this)}>
				<AppbarSecondary {...this.props}>
					<Text style={styles.searchbarText}>Search for communties...</Text>
					<AppbarIcon name="search" style={styles.icon} />
				</AppbarSecondary>
			</TouchableHighlight>
		);
	}
}

SearchBar.propTypes = {
	navigator: React.PropTypes.object.isRequired
};
