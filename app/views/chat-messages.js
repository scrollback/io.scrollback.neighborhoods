import React from "react-native";
import ChatItemContainer from "../containers/chat-item-container";
import PageFailed from "./page-failed";
import PageLoading from "./page-loading";
import LoadingItem from "./loading-item";

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

	_getDataSource() {
		return this._dataSource.cloneWithRows(this.props.data);
	}

	render() {
		return (
			<View {...this.props}>
				{(() => {
					if (this.props.data.length === 0) {
						return <PageFailed pageLabel="No messages yet" />;
					}

					if (this.props.data.length === 1) {
						switch (this.props.data[0]) {
						case "missing":
							return <PageLoading />;
						case "banned":
							return <PageFailed pageLabel="You're banned in this community" />;
						case "nonexistent":
							return <PageFailed pageLabel="This discussion doesn't exist" />;
						case "failed":
							return <PageFailed pageLabel="Failed to load messages" onRetry={this.props.refreshData} />;
						}
					}

					const dataSource = this._getDataSource();

					return (
						<ListView
							removeClippedSubviews
							keyboardShouldPersistTaps={false}
							style={styles.inverted}
							contentContainerStyle={styles.container}
							initialListSize={1}
							onEndReachedThreshold={1000}
							onEndReached={this.props.onEndReached}
							dataSource={dataSource}
							renderRow={item => {
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
							}}
						/>
					);
				})()}
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
