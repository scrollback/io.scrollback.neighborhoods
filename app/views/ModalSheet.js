import React from "react-native";
import Colors from "../../Colors.json";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	sheet: {
		backgroundColor: Colors.white,
		elevation: 16
	}
});

export default class ModalSheet extends React.Component {
	render() {
		return (
			<View {...this.props} style={[ styles.sheet, this.props.style ]}>
				{this.props.children}
			</View>
		);
	}
}

ModalSheet.propTypes = {
	children: React.PropTypes.node.isRequired
};
