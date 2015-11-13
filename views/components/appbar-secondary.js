import React from "react-native";
import Colors from "../../colors.json";

const {
	PixelRatio,
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	appbar: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: Colors.white,
		borderColor: Colors.placeholder,
		borderBottomWidth: 1 / PixelRatio.get(),
		paddingHorizontal: 4,
		height: 56
	}
});

export default class AppbarSecondary extends React.Component {
	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		return (
			<View
				{...this.props}
				style={[ styles.appbar, this.props.style ]}
				ref={c => this._root = c}
			>
				{this.props.children}
			</View>
		);
	}
}

AppbarSecondary.propTypes = {
	children: React.PropTypes.node
};
