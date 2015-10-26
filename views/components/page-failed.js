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
		opacity: 0.5
	}
});

export default class PageFailed extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.pageLabel !== nextProps.pageLabel ||
			this.props.onRetry !== nextProps.onRetry
		);
	}

	render() {
		return (
			<Page {...this.props}>
				<TouchableOpacity onPress={this.props.onRetry} style={styles.container}>
					<Text style={styles.missing}>{this.props.pageLabel}</Text>

					{this.props.onRetry ?
					<View style={styles.button}>
						<Icon
							name="refresh"
							style={styles.icon}
							size={24}
						/>
						<Text style={styles.label}>Retry</Text>
					</View> :
					null
				}
				</TouchableOpacity>
			</Page>
		);
	}
}

PageFailed.propTypes = {
	pageLabel: React.PropTypes.string,
	onRetry: React.PropTypes.func
};

PageFailed.defaultProps = {
	pageLabel: "Failed to load data"
};

