import React from "react-native";
import DiscussionItemContainer from "../containers/DiscussionItemContainer";
import PageEmpty from "./PageEmpty";
import PageLoading from "./PageLoading";
import LoadingItem from "./LoadingItem";
import StartDiscussionButton from "./StartDiscussionButton";
import BannerOfflineContainer from "../containers/BannerOfflineContainer";

const {
	StyleSheet,
	ListView,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		paddingTop: 4,
		paddingBottom: 88
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

	_getDataSource = () => {
		return this._dataSource.cloneWithRows(this.props.data);
	};

	render() {
		return (
			<View {...this.props}>
				<BannerOfflineContainer />

				{(() => {
					if (this.props.data.length === 0) {
						return <PageEmpty label="No discussions yet" image="sad" />;
					}

					if (this.props.data.length === 1) {
						switch (this.props.data[0]) {
						case "missing":
							return <PageLoading />;
						case "banned":
							return <PageEmpty label="You're banned in this community" image="meh" />;
						case "nonexistent":
							return <PageEmpty label="This community doesn't exist" image="sad" />;
						case "failed":
							return <PageEmpty label="Failed to load discussions" image="sad" />;
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
									<DiscussionItemContainer
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
