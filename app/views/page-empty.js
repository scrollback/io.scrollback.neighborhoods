import React from "react-native";
import Colors from "../../colors.json";
import AppText from "./app-text";
import Page from "./page";

const {
	StyleSheet,
	Image
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignSelf: "stretch",
		alignItems: "center",
		justifyContent: "center"
	},
	missing: {
		margin: 16,
		textAlign: "center",
		fontSize: 16,
		lineHeight: 24
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16
	},
	label: {
		paddingHorizontal: 8,
		marginHorizontal: 8
	},
	icon: {
		color: Colors.fadedBlack
	}
});

export default class PageEmpty extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.label !== nextProps.label ||
			this.props.image !== nextProps.image
		);
	}

	_getImageSource(name) {
		switch (name) {
		case "cool":
			return require("../../assets/monkey-cool.png");
		case "happy":
			return require("../../assets/monkey-happy.png");
		case "meh":
			return require("../../assets/monkey-meh.png");
		case "sad":
			return require("../../assets/monkey-sad.png");
		}
	}

	render() {
		return (
			<Page {...this.props}>
				{this.props.image ?
					<Image source={this._getImageSource(this.props.image)} /> :
					null
				}
				{this.props.label ?
					<AppText style={styles.missing}>{this.props.label}</AppText> :
					null
				}
			</Page>
		);
	}
}

PageEmpty.propTypes = {
	label: React.PropTypes.string,
	image: React.PropTypes.any
};
