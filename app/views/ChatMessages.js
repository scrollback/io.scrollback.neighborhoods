import React from "react-native";
import ChatItemContainer from "../containers/ChatItemContainer";
import PageEmpty from "./PageEmpty";
import PageLoading from "./PageLoading";
import LoadingItem from "./LoadingItem";

const {
	StyleSheet,
	ListView,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		paddingVertical: 4
	},
	inverted: {
		transform: [
			{ scaleY: -1 }
		]
	},
	item: {
		overflow: "hidden"
	}
});

export default class ChatMessages extends React.Component {
	constructor(props) {
		super(props);

		this._dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
	}

	componentDidMount() {
		if (this._scroll) {
			this._scroll.scrollTo(0);
		}
	}

	_getDataSource = () => {
		return this._dataSource.cloneWithRows(this.props.data);
	};

	_renderRow = item => {
		if (item === "missing") {
			return <LoadingItem />;
		}

		return (
			<ChatItemContainer
				key={item.text.id}
				text={item.text}
				metadata={item.metadata}
				previousText={item.previousText}
				currentUser={this.props.user}
				replyToMessage={this.props.replyToMessage}
				quoteMessage={this.props.quoteMessage}
				style={[ styles.item, styles.inverted ]}
			/>
		);
	};

	render() {
		let placeHolder;

		if (this.props.data.length === 0) {
			placeHolder = <PageEmpty label="No messages yet" image="sad" />;
		} else if (this.props.data.length === 1) {
			switch (this.props.data[0]) {
			case "missing":
				placeHolder = <PageLoading />;
				break;
			case "banned":
				placeHolder = <PageEmpty label="You're banned in this community" image="meh" />;
				break;
			case "nonexistent":
				placeHolder = <PageEmpty label="This discussion doesn't exist" image="sad" />;
				break;
			case "failed":
				placeHolder = <PageEmpty label="Failed to load messages" image="sad" />;
				break;
			}
		}

		return (
			<View {...this.props}>
				{placeHolder ? placeHolder :
					<ListView
						removeClippedSubviews
						keyboardShouldPersistTaps={false}
						style={styles.inverted}
						contentContainerStyle={styles.container}
						initialListSize={1}
						onEndReachedThreshold={1000}
						onEndReached={this.props.onEndReached}
						dataSource={this._getDataSource()}
						renderRow={this._renderRow}
					/>
				}
			</View>
		);
	}
}

ChatMessages.propTypes = {
	data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
		React.PropTypes.oneOf([ "missing", "failed" ]),
		React.PropTypes.shape({
			id: React.PropTypes.string
		})
	])).isRequired,
	user: React.PropTypes.string.isRequired,
	onEndReached: React.PropTypes.func.isRequired,
	quoteMessage: React.PropTypes.func.isRequired,
	replyToMessage: React.PropTypes.func.isRequired,
	refreshData: React.PropTypes.func
};
