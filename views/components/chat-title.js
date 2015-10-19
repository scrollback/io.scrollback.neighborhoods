import React from "react-native";
import AppbarTouchable from "./appbar-touchable";
import routes from "../utils/routes";

const {
	StyleSheet,
	Text
} = React;

const styles = StyleSheet.create({
	container: {
		marginRight: 64,
		paddingVertical: 10
	},
	title: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 14
	},
	subtitle: {
		color: "rgba(255, 255, 255, .5)",
		fontSize: 12,
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
				<Text numberOfLines={1} style={styles.title}>
					{title}
				</Text>
				<Text numberOfLines={1} style={styles.subtitle}>
					{concerns} {concerns > 1 ? " people" : " person"} talking
				</Text>
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
