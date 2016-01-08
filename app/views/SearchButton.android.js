import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import AppbarSecondary from "./AppbarSecondary";
import AppbarIcon from "./AppbarIcon";
import Modal from "./Modal";
import LocalitiesFilterContainer from "../containers/LocalitiesFilteredContainer";

const {
	StyleSheet,
	TouchableHighlight
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
	shouldComponentUpdate() {
		return false;
	}

	_onPress = () => {
		Modal.renderComponent(<LocalitiesFilterContainer dismiss={() => Modal.renderComponent(null)} navigator={this.props.navigator} />);
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

SearchBar.propTypes = {
	navigator: React.PropTypes.object.isRequired
};
