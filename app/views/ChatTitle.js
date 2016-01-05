import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import AppbarTouchable from "./AppbarTouchable";
import routes from "../utils/routes";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		marginRight: 64,
		height: 56,
		justifyContent: "center"
	},
	title: {
		color: Colors.white,
		fontWeight: "bold"
	},
	subtitle: {
		color: Colors.fadedWhite,
		fontSize: 12,
		lineHeight: 18,
		width: 160
	}
});

export default class ChatTitle extends React.Component {
	_onPress() {
		const { thread } = this.props;

		if (thread && thread.id) {
			this.props.navigator.push(routes.people({ thread: thread.id }));
		}
	}

	render() {
		const { thread } = this.props;

		let title = "…",
			concerns = 1;

		if (thread && thread.title) {
			title = thread.title;
			concerns = thread.concerns && thread.concerns.length ? thread.concerns.length : 1;
		} else if (thread === "missing") {
			title = "Loading…";
		}

		return (
			<AppbarTouchable onPress={this._onPress.bind(this)} style={styles.container}>
				<View style={styles.container}>
					<AppText numberOfLines={1} style={styles.title}>
						{title}
					</AppText>
					<AppText numberOfLines={1} style={styles.subtitle}>
						{concerns} {concerns > 1 ? " people" : " person"} talking
					</AppText>
				</View>
			</AppbarTouchable>
		);
	}
}

ChatTitle.propTypes = {
	thread: React.PropTypes.oneOfType([
		React.PropTypes.shape({
			title: React.PropTypes.string.isRequired,
			concerns: React.PropTypes.arrayOf(React.PropTypes.string)
		}),
		React.PropTypes.string
	]).isRequired,
	navigator: React.PropTypes.object.isRequired
};
