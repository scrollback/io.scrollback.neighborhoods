import React from "react-native";
import Icon from "./icon";
import Page from "./page";

const {
	StyleSheet,
	View,
	Text,
	TouchableOpacity
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignSelf: "stretch",
		alignItems: "center",
		justifyContent: "center"
	},
	missing: {
		fontSize: 18
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
		color: "#000",
		fontSize: 24,
		opacity: 0.5
	}
});

export default class PageRetry extends React.Component {
	render() {
		return (
			<Page {...this.props}>
				<TouchableOpacity onPress={this.props.onRetry} style={styles.container}>
					<Text style={styles.missing}>Failed to load data</Text>

					{this.props.onRetry ?
					<View style={styles.button}>
						<Icon name="refresh" style={styles.icon} />
						<Text style={styles.label}>Retry</Text>
					</View> :
					null
				}
				</TouchableOpacity>
			</Page>
		);
	}
}

PageRetry.propTypes = {
	onRetry: React.PropTypes.func
};
