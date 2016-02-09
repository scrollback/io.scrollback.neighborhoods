/* @flow */

import React from 'react-native';
import Discussions from '../views/Discussions';
import Container from './Container';
import store from '../store/store';

class DiscussionsContainer extends React.Component {
	static propTypes = {
		room: React.PropTypes.string.isRequired
	};

	state = {
		data: [ 'missing' ],
		user: ''
	};

	componentDidMount() {
		this.handle('statechange', changes => {
			if (changes.threads && changes.threads[this.props.room]) {
				this._updateData();
			}
		});

		this.runAfterInteractions(async () => {
			this.emit('setstate', {
				nav: {
					room: this.props.room,
					mode: 'room'
				}
			});

			const requested = store.get('nav', this.props.room + '_requested');

			if (requested) {
				this._updateData();
			} else {
				this._handleEndReached();
			}
		});
	}

	_updateData = () => {
		const requested = store.get('nav', this.props.room + '_requested');
		const threads = store.getThreads(this.props.room, null, -requested);

		this.setState({
			data: threads.reverse(),
			user: store.get('user')
		});
	};

	_handleEndReached = () => {
		const key = this.props.room + '_requested';
		const requested = store.get('nav', key);
		const threads = store.getThreads(this.props.room, null, -requested);

		if (requested && requested > (threads.length + 1)) {
			return;
		}

		this.emit('setstate', {
			nav: {
				[key]: (requested || 0) + 20
			}
		});
	};

	render() {
		return (
			<Discussions
				{...this.props}
				{...this.state}
				onEndReached={this._handleEndReached}
			/>
		);
	}
}

export default Container(DiscussionsContainer);
