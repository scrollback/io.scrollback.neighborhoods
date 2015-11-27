import React from "react-native";
import DiscussionItemController from "../controllers/discussion-item-controller";
import PageFailed from "./page-failed";
import PageLoading from "./page-loading";
import LoadingItem from "./loading-item";
import StartDiscussionButton from "./start-discussion-button";
import BannerOfflineController from "../controllers/banner-offline-controller";

const {
	StyleSheet,
	ListView,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		paddingVertical: 4
	},
	item: {
		overflow: "hidden"
	}
});

export default class Discussions extends React.Component {
	constructor(props) {
		super(props);

		this._dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
	}

	_getDataSource() {
		return this._dataSource.cloneWithRows(this.props.data);
	}

	render() {
		return (
			<View {...this.props}>
				<BannerOfflineController />

				{(() => {
					if (this.props.data.length === 0) {
						return <PageFailed pageLabel="No discussions yet" />;
					}

					if (this.props.data.length === 1) {
						switch (this.props.data[0]) {
						case "missing":
							return <PageLoading />;
						case "banned":
							return <PageFailed pageLabel="You're banned in this community" />;
						case "nonexistent":
							return <PageFailed pageLabel="This community doesn't exist" />;
						case "failed":
							return <PageFailed pageLabel="Failed to load discussions" onRetry={this.props.refreshData} />;
						}
					}

					return (
						<ListView
							removeClippedSubviews
							contentContainerStyle={styles.container}
							initialListSize={1}
							onEndReachedThreshold={1000}
							onEndReached={this.props.onEndReached}
							dataSource={this._getDataSource()}
							renderRow={thread => {
								if (thread === "missing") {
									return <LoadingItem />;
								}

								return (
									<DiscussionItemController
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
