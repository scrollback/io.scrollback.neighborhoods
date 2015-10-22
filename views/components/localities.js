import React from "react-native";
import LocalitiesBase from "./localities-base";
import SearchButton from "./search-button";
import BannerOfflineController from "../controllers/banner-offline-controller";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default class Localities extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<BannerOfflineController />
				<SearchButton navigator={this.props.navigator} />
				<LocalitiesBase {...this.props} />
			</View>
		);
	}
}

Localities.propTypes = {
	navigator: React.PropTypes.object.isRequired
};

