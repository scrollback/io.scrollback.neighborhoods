/* @flow */

import React from 'react-native';
import Chat from '../views/Chat';
import Container from './Container';
import store from '../store/store';

class ChatContainer extends React.Component {
	static propTypes = {
		room: React.PropTypes.string.isRequired,
		thread: React.PropTypes.string.isRequired
	};

	state = {
		user: 'missing'
	};

	componentDidMount() {
		this.runAfterInteractions(this._updateData);
	}

	_updateData = () => {
		this.setState({
			user: store.get('user')
		});
	};

	_sendMessage = (text, textId) => {
		const textObj = {
			id: null,
			text: text.trim(),
			thread: this.props.thread,
			to: this.props.room,
			from: this.state.user
		};

		if (textId) {
			textObj.id = textId;
		}

		this.dispatch('text', textObj);
	};

	render() {
		return (
			<Chat
				sendMessage={this._sendMessage}
				{...this.props}
				{...this.state}
			/>
		);
	}
}

export default Container(ChatContainer);
