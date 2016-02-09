import React from 'react-native';
import PageLoading from './PageLoading';
import ChatMessagesContainer from '../containers/ChatMessagesContainer';
import ChatInput from './ChatInput';
import BannerOfflineContainer from '../containers/BannerOfflineContainer';

const {
	View,
	StyleSheet
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

export default class Chat extends React.Component {
	_quoteMessage = text => {
		this._input.quotedText = text;
	};

	_replyToMessage = user => {
		this._input.replyTo = user;
	};

	render() {
		if (this.props.user === 'missing') {
			return <PageLoading />;
		}

		return (
			<View {...this.props}>
				<BannerOfflineContainer />

				<ChatMessagesContainer
					style={styles.container}
					room={this.props.room}
					thread={this.props.thread}
					user={this.props.user}
					quoteMessage={this._quoteMessage}
					replyToMessage={this._replyToMessage}
				/>

				<ChatInput
					ref={c => this._input = c}
					room={this.props.room}
					thread={this.props.thread}
					user={this.props.user}
					sendMessage={this.props.sendMessage}
				/>
			</View>
		);
	}
}

Chat.propTypes = {
	room: React.PropTypes.string.isRequired,
	thread: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired,
	sendMessage: React.PropTypes.func.isRequired
};
