/**
 * A searchable ListView with memoization
 * Supports both synchornous and async results
 *
 *  @flow
 */

import React from "react-native";
import SearchBar from "./Searchbar";
import PageEmpty from "./PageEmpty";
import PageLoading from "./PageLoading";
import debounce from "../lib/debounce";

const {
	StyleSheet,
	View,
	ListView,
	RecyclerViewBackedScrollView
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});

type State = {
	filter: string;
	data: Array<Object | string>;
}

export default class SearchableList extends React.Component {
	static propTypes = {
		getResults: React.PropTypes.func.isRequired,
		renderRow: React.PropTypes.func.isRequired,
		renderHeader: React.PropTypes.func,
		onDismiss: React.PropTypes.func.isRequired,
		searchHint: React.PropTypes.string.isRequired,
		style: View.propTypes.style,
	};

	state: State = {
		filter: "",
		data: [ "missing" ],
	};

	componentDidMount() {
		this._fetchResults();
	}

	_dataSource = new ListView.DataSource({
		rowHasChanged: (r1, r2) => r1 !== r2
	});

	_cachedResults = {};

	_fetchResults = debounce(async (filter: string): Promise => {
		try {
			let data;

			if (this._cachedResults[filter]) {
				data = this._cachedResults[filter];
			} else {
				data = await this.props.getResults(filter);
				this._cachedResults[filter] = data;
			}

			this.setState({
				data: data.length || filter ? data : [ "blankslate" ]
			});
		} catch (e) {
			this.setState({
				data: [ "failed" ]
			});
		}
	});

	_handleChangeSearch = (filter: string) => {
		this.setState({
			filter,
			data: [ "missing" ]
		});

		this._fetchResults(filter);
	};

	_getDataSource = (): ListView.DataSource => {
		return this._dataSource.cloneWithRows(this.state.data);
	};

	_renderHeader = () => {
		if (this.props.renderHeader) {
			return this.props.renderHeader(this.state.filter, this.state.data);
		}

		return null;
	};

	_renderScrollComponent = props => <RecyclerViewBackedScrollView {...props} />;

	render() {
		let placeHolder;

		if (this.state.data) {
			switch (this.state.data.length) {
			case 0:
				placeHolder = <PageEmpty label="No results found" image="sad" />;
				break;
			case 1:
				switch (this.state.data[0]) {
				case "blankslate":
					placeHolder = <PageEmpty label="Come on, type something!" image="happy" />;
					break;
				case "missing":
					placeHolder = <PageLoading />;
					break;
				case "failed":
					placeHolder = <PageEmpty label="Failed to load results" image="sad" />;
					break;
				}
			}
		}

		return (
			<View {...this.props} style={[ styles.container, this.props.style ]}>
				<SearchBar
					placeholder={this.props.searchHint}
					onBack={this.props.onDismiss}
					onChangeSearch={this._handleChangeSearch}
					autoFocus
				/>
				{placeHolder ?
					placeHolder :
					<ListView
						keyboardShouldPersistTaps
						initialListSize={1}
						dataSource={this._getDataSource()}
						renderScrollComponent={this._renderScrollComponent}
						renderRow={this.props.renderRow}
						renderHeader={this._renderHeader}
					/>
				}
			</View>
		);
	}
}
