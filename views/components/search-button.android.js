import React from "react-native";
import Modal from "./modal";
import LocalitiesFilterController from "../controllers/localities-filtered-controller";

const {
	StyleSheet,
	TouchableHighlight,
	PixelRatio,
	Image,
	Text,
	View
} = React;

const styles = StyleSheet.create({
	searchbar: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		borderColor: "rgba(0, 0, 0, .24)",
		borderBottomWidth: 1 / PixelRatio.get(),
		height: 56
	},
	searchbarText: {
		flex: 1,
		fontSize: 16,
		marginHorizontal: 16
	},
	iconContainer: {
		paddingHorizontal: 22,
		alignSelf: "stretch",
		alignItems: "center",
		justifyContent: "center"
	},
	icon: {
		width: 24,
		height: 24,
		opacity: 0.5
	}
});

export default class SearchBar extends React.Component {
	_onPress() {
		Modal.renderComponent(<LocalitiesFilterController dismiss={() => Modal.renderComponent(null)} navigator={this.props.navigator} />);
	}

	render() {
		return (
			<TouchableHighlight underlayColor="rgba(0, 0, 0, .16)" onPress={this._onPress.bind(this)}>
				<View {...this.props} style={[ styles.searchbar, this.props.style ]}>
					<Text style={styles.searchbarText}>Search for places...</Text>

					<View style={styles.iconContainer}>
						<Image
							source={require("image!ic_search_black")}
							style={styles.icon}
						/>
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}

SearchBar.propTypes = {
	navigator: React.PropTypes.object.isRequired
};
