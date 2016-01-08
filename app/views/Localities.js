import React from "react-native";
import LocalitiesBase from "./LocalitiesBase";
import SearchButton from "./SearchButton";
import BannerUnavailable from "./BannerUnavailable";
import BannerOfflineContainer from "../containers/BannerOfflineContainer";

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
				<BannerOfflineContainer />
				{this.props.available === false ?
					<BannerUnavailable /> :
					<SearchButton navigator={this.props.navigator} />}
				<LocalitiesBase
					{...this.props}
					pageEmptyLabel="You've not joined any communities"
					pageEmptyImage="meh"
				/>
			</View>
		);
	}
}

Localities.propTypes = {
	available: React.PropTypes.bool,
	navigator: React.PropTypes.object.isRequired
};
