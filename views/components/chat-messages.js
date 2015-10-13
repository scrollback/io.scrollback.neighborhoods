import React from "react-native";
import InvertibleScrollView from "react-native-invertible-scroll-view";
import ChatItem from "./chat-item";
import PageEmpty from "./page-empty";
import PageLoading from "./page-loading";
import PageRetry from "./page-retry";

const {
	StyleSheet,
	ListView,
	View
} = React;

const styles = StyleSheet.create({
	item: {
		overflow: "hidden"
	}
});

export default class ChatMessages extends React.Component {
	constructor(props) {
		super(props);

		this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
	}

	componentDidMount() {
		if (this._scroll) {
			this._scroll.scrollTo(0);
		}
	}

	_getDataSource() {
		return this.dataSource.cloneWithRows(this.props.data);
	}

	render() {
		return (
			<View {...this.props}>
				{(() => {
					if (this.props.data.length === 0) {
						return <PageEmpty />;
					}

					if (this.props.data.length === 1) {
						if (this.props.data[0] === "loading") {
							return <PageLoading />;
						}

						if (this.props.data[0] === "missing") {
							return <PageRetry onRetry={this.props.refreshData} />;
						}
					}

					const dataSource = this._getDataSource();

					return (
						<ListView
							removeClippedSubviews
							style={styles.item}
							initialListSize={5}
							onEndReachedThreshold={1000}
							onEndReached={this.props.onEndReached}
							renderScrollComponent={props =>
								<InvertibleScrollView
									{...props}
									inverted
									ref={c => this._scroll = c}
								/>
							}
							dataSource={dataSource}
							renderRow={item => {
								if (item === "missing") {
									return null;
								}

								return (
									<ChatItem
										key={item.text.id}
										text={item.text}
										previousText={item.previousText}
										currentUser={this.props.user}
										replyToMessage={this.props.replyToMessage}
										quoteMessage={this.props.quoteMessage}
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
		React.PropTypes.oneOf([ "loading", "missing" ]),
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
