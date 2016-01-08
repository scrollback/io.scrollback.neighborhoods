import React from "react-native";
import Colors from "../../Colors.json";

const {
	StyleSheet,
	View,
	Image,
	TouchableOpacity
} = React;

const styles = StyleSheet.create({
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

export default class AccountPhotoChooserItem extends React.Component {
	_handlePress = () => {
		this.props.onPress(this.props.uri);
	};

	render() {
		return (
			<TouchableOpacity onPress={this._handlePress}>
				<View style={styles.photoContainer}>
					<Image style={styles.photo} source={{ uri: this.props.uri }} />
				</View>
			</TouchableOpacity>
		);
	}
}

AccountPhotoChooserItem.propTypes = {
	uri: React.PropTypes.string.isRequired,
	onPress: React.PropTypes.func.isRequired
};
