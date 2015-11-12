import React from "react-native";
import Colors from "../../colors.json";
import Icon from "./icon";
import Modal from "./modal";
import StartDiscussionController from "../controllers/start-discussion-controller";

const {
	StyleSheet,
	TouchableHighlight,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		right: 16,
		bottom: 16,
		height: 56,
		width: 56,
		borderRadius: 28
	},
	fab: {
		backgroundColor: Colors.accent,
		height: 56,
		width: 56,
		borderRadius: 28
	},
	icon: {
		margin: 16,
		color: Colors.fadedBlack
	}
});

export default class StartDiscussionButton extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.room !== nextProps.room ||
			this.props.user !== nextProps.user
		);
	}

	_onPress() {
		Modal.renderComponent(<StartDiscussionController {...this.props} dismiss={() => Modal.renderComponent(null)} />);
	}

	render() {
		return (
			<TouchableHighlight
				{...this.props}
				style={styles.container}
				onPress={this._onPress.bind(this)}
			>
				<View style={styles.fab}>
					<Icon
						name="create"
						style={styles.icon}
						size={24}
					/>
				</View>
			</TouchableHighlight>
		);
	}
}

StartDiscussionButton.propTypes = {
	room: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired,
	navigator: React.PropTypes.object.isRequired
};
