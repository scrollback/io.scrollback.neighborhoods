/* @flow */

import React from 'react-native';
import ShareButton from '../views/ShareButton';
import Container from './Container';
import store from '../store/store';

class ShareButtonContainer extends React.Component {
	static propTypes = {
		thread: React.PropTypes.string.isRequired
	};

	state = {
		thread: null
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
		return (
			<ShareButton
				{...this.props}
				{...this.state}
			/>
		);
	}
}

export default Container(ShareButtonContainer);
