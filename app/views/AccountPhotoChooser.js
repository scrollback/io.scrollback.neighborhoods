import React from "react-native";
import AccountPhotoChooserItem from "./AccountPhotoChooserItem";

const {
	StyleSheet,
	View,
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 8
	}
});

export default class AccountPhotoChooser extends React.Component {
	render() {
		const { photos } = this.props;

		return (
			<View style={styles.container}>
				{photos.filter((uri, i) => photos.indexOf(uri) === i).slice(0, 9).map(uri => (
					<AccountPhotoChooserItem
						key={uri}
						uri={uri}
						onPress={this.props.onSelect}
					/>
				))}
			</View>
		);
	}
}

AccountPhotoChooser.propTypes = {
	photos: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
	onSelect: React.PropTypes.func.isRequired
};
