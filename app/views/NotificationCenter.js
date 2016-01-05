import React from "react-native";
import NotificationCenterItem from "./NotificationCenterItem";
import PageEmpty from "./PageEmpty";
import PageLoading from "./PageLoading";

const {
	ListView,
	View
} = React;

export default class NotificationCenter extends React.Component {
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
						return <PageEmpty label="No new notifications" image="cool" />;
					}

					if (this.props.data.length === 1) {
						if (this.props.data[0] === "missing") {
							return <PageLoading />;
						}

						if (this.props.data[0] === "failed") {
							return <PageEmpty label="Failed to load notifications" image="sad" />;
						}
					}

					const dataSource = this._getDataSource();

					return (
						<ListView
							initialListSize={1}
							dataSource={dataSource}
							renderRow={note => {
								return (
									<NotificationCenterItem
										key={note.ref + note.type}
										note={note}
										navigator={this.props.navigator}
										dismissNote={this.props.dismissNote}
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

NotificationCenter.propTypes = {
	data: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
		React.PropTypes.oneOf([ "missing", "failed" ]),
		React.PropTypes.shape({
			id: React.PropTypes.string
		})
	])).isRequired,
	dismissNote: React.PropTypes.func.isRequired,
	refreshData: React.PropTypes.func,
	navigator: React.PropTypes.object.isRequired
};
