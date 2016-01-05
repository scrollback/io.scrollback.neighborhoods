import React from "react-native";
import FloatingActionButton from "./FloatingActionButton";
import Modal from "./Modal";
import StartDiscussionContainer from "../containers/StartDiscussionContainer";

export default class StartDiscussionButton extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.room !== nextProps.room ||
			this.props.user !== nextProps.user
		);
	}

	_onPress() {
		Modal.renderComponent(<StartDiscussionContainer {...this.props} dismiss={() => Modal.renderComponent(null)} />);
	}

	render() {
		return (
			<FloatingActionButton
				{...this.props}
				icon="create"
				onPress={this._onPress.bind(this)}
			/>
		);
	}
}

StartDiscussionButton.propTypes = {
	room: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired,
	navigator: React.PropTypes.object.isRequired
};
