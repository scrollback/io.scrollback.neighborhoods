/* @flow */

import React from 'react-native';
import ChatTitle from '../views/ChatTitle';
import Container from './Container';
import store from '../store/store';

class ChatTitleContainer extends React.Component {
	static propTypes = {
		thread: React.PropTypes.string.isRequired
	};

	state = {
		thread: 'missing'
	};

	componentDidMount() {
		this.runAfterInteractions(this._updateData);

		this.handle('statechange', changes => {
			if (changes.indexes && changes.indexes.threadsById && changes.indexes.threadsById[this.props.thread]) {
				this._updateData();
			}
		});
	}

	_updateData = () => {
		const thread = store.getThreadById(this.props.thread);

		if (thread) {
			this.setState({
				thread
			});
		}
	};

	render() {
		return <ChatTitle {...this.props} {...this.state} />;
	}
}

export default Container(ChatTitleContainer);
