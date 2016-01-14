import React from "react-native";
import VersionCodes from "../modules/VersionCodes";

const {
	Platform,
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	statusbar: {
		height: Platform.OS === "android" ? 25 : 20 // offset for statusbar height
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

// Versions below KitKat don't have translucent statusbar
export default Platform.OS === "android" && Platform.Version < VersionCodes.KITKAT ? View : StatusbarContainer;
