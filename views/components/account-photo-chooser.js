import React from "react-native";

const {
	StyleSheet,
	View,
	Image,
	TouchableOpacity
} = React;

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 8
	},

	photo: {
		height: 96,
		width: 96,
		borderRadius: 48,
		margin: 8
	}
});

export default class AccountPhotoChooser extends React.Component {
	render() {
		const { photos } = this.props;

		return (
			<View style={styles.container}>
				{photos.filter((uri, i) => photos.indexOf(uri) === i).slice(0, 9).map(uri => {
					return (
						<TouchableOpacity onPress={() => this.props.onSelect(uri)}>
							<Image style={styles.photo} source={{ uri }} />
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}
}

AccountPhotoChooser.propTypes = {
	photos: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
	onSelect: React.PropTypes.func.isRequired
};
