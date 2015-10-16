import React from "react-native";
import DiscussionItem from "./discussion-item";
import PageFailed from "./page-failed";
import PageLoading from "./page-loading";
import StartDiscussionButton from "./start-discussion-button";

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

export default class Discussions extends React.Component {
	constructor(props) {
		super(props);

		this.dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
	}

	_getDataSource() {
		return this.dataSource.cloneWithRows(this.props.data);
	}

	render() {
		return (
			<View {...this.props}>
				{(() => {
					if (this.props.data.length === 0) {
						return <PageFailed pageLabel="No discussions yet" />;
					}

					if (this.props.data.length === 1) {
						if (this.props.data[0] === "missing") {
							return <PageLoading />;
						}

						if (this.props.data[0] === "failed") {
							return <PageFailed pageLabel="Failed to load discussions" onRetry={this.props.refreshData} />;
						}
					}

					return (
						<ListView
							removeClippedSubviews
							style={styles.item}
							initialListSize={3}
							onEndReachedThreshold={1000}
							onEndReached={this.props.onEndReached}
							dataSource={this._getDataSource()}
							renderRow={thread => {
								if (thread === "missing") {
									return null;
								}

								return (
									<DiscussionItem
										key={thread.id}
										thread={thread}
										navigator={this.props.navigator}
										style={styles.item}
									/>
								);
							}}
						/>
					);
				})()}

				<StartDiscussionButton
					room={this.props.room}
					user={this.props.user}
					navigator={this.props.navigator}
				/>
			</View>
		);
	}
}

Discussions.propTypes = {
	data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
		React.PropTypes.oneOf([ "missing", "failed" ]),
		React.PropTypes.shape({
			id: React.PropTypes.string
		})
	])).isRequired,
	room: React.PropTypes.string.isRequired,
	user: React.PropTypes.string.isRequired,
	refreshData: React.PropTypes.func,
	onEndReached: React.PropTypes.func.isRequired,
	navigator: React.PropTypes.object.isRequired
};
