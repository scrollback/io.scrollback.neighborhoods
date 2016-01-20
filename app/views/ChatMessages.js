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

	render() {
		return (
			<View {...this.props}>
				{(() => {
					if (this.props.data.length === 0) {
						return <PageEmpty label="No messages yet" image="sad" />;
					}

					if (this.props.data.length === 1) {
						switch (this.props.data[0]) {
						case "missing":
							return <PageLoading />;
						case "banned":
							return <PageEmpty label="You're banned in this community" image="meh" />;
						case "nonexistent":
							return <PageEmpty label="This discussion doesn't exist" image="sad" />;
						case "failed":
							return <PageEmpty label="Failed to load messages" image="sad" />;
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
