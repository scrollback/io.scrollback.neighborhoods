import React from "react-native";
import VersionCodes from "../../modules/version-codes";

const {
	Platform,
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	statusbar: {
		height: 25 // offset for statusbar height
	}
});

class StatusbarContainer extends React.Component {
	render() {
		return (
			<View {...this.props}>
				<View style={[ styles.statusbar, this.props.statusbarStyle ]} />

				{this.props.children}
			</View>
		);
	}
}

StatusbarContainer.propTypes = {
	children: React.PropTypes.node,
	statusbarStyle: React.PropTypes.any
};

// The app pans to show the Keyboard below Kitkat (We set it to resize from Kitkat to upwards)
export default Platform.OS === "android" && Platform.Version < VersionCodes.KITKAT ? View : StatusbarContainer;
