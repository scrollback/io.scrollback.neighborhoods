import React from "react-native";
import LocalitiesBase from "./localities-base";
import SearchButton from "./search-button";
import BannerUnavailable from "./banner-unavailable";
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
				{this.props.available === false ?
					<BannerUnavailable /> :
					<SearchButton navigator={this.props.navigator} />}
				<LocalitiesBase {...this.props} pageEmptyLabel="You've not joined any communities" />
			</View>
		);
	}
}

Localities.propTypes = {
	available: React.PropTypes.bool,
	navigator: React.PropTypes.object.isRequired
};
