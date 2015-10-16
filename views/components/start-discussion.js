import React from "react-native";
import Loading from "./loading";
import GrowingTextInput from "./growing-text-input";
import TouchFeedback from "./touch-feedback";

const {
	StyleSheet,
	View,
	Text,
	TextInput
} = React;

const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: "#fff"
	},
	actions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		paddingVertical: 16
	},
	button: {
		alignItems: "center",
		backgroundColor: "#673AB7",
		paddingVertical: 12,
		borderRadius: 3,
		width: 80
	},
	buttonText: {
		color: "#fff"
	},
	loading: {
		height: 19,
		width: 19
	}
});

export default class StartDiscussionButton extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			title: "",
			text: "",
			status: null
		};
	}

	_onPress() {
		if (this.state.status === "loading") {
			return;
		}

		if (this.state.title && this.state.text) {
			this.props.postDiscussion(this.state.title, this.state.text);

			this.setState({
				status: "loading"
			});
		}
	}

	_onTitleChange(e) {
		this.setState({
			title: e.nativeEvent.text
		});
	}

	_onTextChange(e) {
		this.setState({
			text: e.nativeEvent.text
		});
	}

	render() {
		const isLoading = this.state.status === "loading";

		return (
			<View {...this.props} style={[ styles.container, this.props.style ]}>
				<TextInput
					autoFocus
					value={this.state.title}
					onChange={this._onTitleChange.bind(this)}
					placeholder="Enter discussion title"
					autoCapitalize="sentences"
				/>

				<GrowingTextInput
					numberOfLines={5}
					value={this.state.text}
					onChange={this._onTextChange.bind(this)}
					placeholder="Enter discussion summary"
					autoCapitalize="sentences"
				/>

				<View style={styles.actions}>
					<TouchFeedback onPress={this._onPress.bind(this)}>
						<View style={styles.button}>
							{isLoading ?
								<Loading style={styles.loading} /> :
								<Text style={styles.buttonText}>Post</Text>
							}
						</View>
					</TouchFeedback>
				</View>
			</View>
		);
	}
}

StartDiscussionButton.propTypes = {
	room: React.PropTypes.string.isRequired,
	postDiscussion: React.PropTypes.func.isRequired
};
