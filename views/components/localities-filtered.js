import React from "react-native";
import LocalitiesBase from "./localities-base";
import SearchBar from "./searchbar";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#eee"
	},
	inner: {
		flex: 1
	}
});

export default class LocalitiesFiltered extends React.Component {
	render() {
		return (
			<View style={styles.container}>
				<SearchBar
					placeholder="Type a name..."
					onBack={this.props.dismiss}
					onSearchChange={this.props.onSearchChange}
					autoFocus
				/>
				<LocalitiesBase {...this.props} style={[ styles.inner, this.props.style ]} />
			</View>
		);
	}
}

LocalitiesFiltered.propTypes = {
	dismiss: React.PropTypes.func.isRequired,
	onSearchChange: React.PropTypes.func.isRequired
};
