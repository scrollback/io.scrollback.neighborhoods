import React from "react-native";
import VersionCodes from "../../modules/version-codes";

const {
	Platform,
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	statusbar: {
		height: Platform.Version < VersionCodes.KITKAT ? 0 : 25 // offset for statusbar height
	}
});

export default class StatusbarContainer extends React.Component {
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
