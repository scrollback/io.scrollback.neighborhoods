import React from "react-native";
import GrowingTextInput from "./growing-text-input";
import LargeButton from "./large-button";

const {
	StyleSheet,
	View,
	TextInput
} = React;

const styles = StyleSheet.create({
	container: {
		padding: 16
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
					onChange={this._onTitleChange.bind(this)}
					placeholder="Enter discussion title"
					autoCapitalize="sentences"
				/>

				<GrowingTextInput
					numberOfLines={5}
					onChange={this._onTextChange.bind(this)}
					placeholder="Enter discussion summary"
					autoCapitalize="sentences"
				/>

				<LargeButton
					style={styles.facebook}
					spinner={isLoading}
					disabled={isLoading}
					text={isLoading ? "" : "Start discussion"}
					onPress={this._onPress.bind(this)}
				/>
			</View>
		);
	}
}

StartDiscussionButton.propTypes = {
	room: React.PropTypes.string.isRequired,
	postDiscussion: React.PropTypes.func.isRequired
};
