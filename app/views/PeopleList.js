import React from "react-native";
import PeopleListItem from "./PeopleListItem";
import PageEmpty from "./PageEmpty";
import PageLoading from "./PageLoading";
import ListHeader from "./ListHeader";
import DiscussionDetailsCard from "./DiscussionDetailsCard";

const {
	ListView,
	View
} = React;

export default class PeopleList extends React.Component {
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
				{(() => {
					if (this.props.data.length === 0) {
						return <PageEmpty label="Nobody here" image="sad" />;
					}

					if (this.props.data.length === 1) {
						if (this.props.data[0] === "missing") {
							return <PageLoading />;
						}

						if (this.props.data[0] === "failed") {
							return <PageEmpty label="Failed to load people list" image="sad" />;
						}
					}

					const dataSource = this._getDataSource();

					return (
						<ListView
							initialListSize={1}
							dataSource={dataSource}
							renderHeader={() => <DiscussionDetailsCard thread={this.props.thread} />}
							renderSectionHeader={() => <ListHeader>People talking</ListHeader>}
							renderRow={user => {
								return (
									<PeopleListItem
										key={user.id}
										user={user}
										navigator={this.props.navigator}
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

PeopleList.propTypes = {
	data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
		React.PropTypes.oneOf([ "missing", "failed" ]),
		React.PropTypes.shape({
			id: React.PropTypes.string
		})
	])).isRequired,
	refreshData: React.PropTypes.func,
	thread: React.PropTypes.object.isRequired,
	navigator: React.PropTypes.object.isRequired
};
