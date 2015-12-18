import React from "react-native";
import Colors from "../../colors.json";

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

	photoContainer: {
		backgroundColor: Colors.placeholder,
		height: 96,
		width: 96,
		borderRadius: 48,
		margin: 8
	},

	photo: {
		height: 96,
		width: 96,
		borderRadius: 48
	}
});

export default class AccountPhotoChooser extends React.Component {
	render() {
		const { photos } = this.props;

		return (
			<View style={styles.container}>
				{photos.filter((uri, i) => photos.indexOf(uri) === i).slice(0, 9).map(uri => {
					return (
						<TouchableOpacity key={uri} onPress={() => this.props.onSelect(uri)}>
							<View style={styles.photoContainer}>
								<Image style={styles.photo} source={{ uri }} />
							</View>
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
