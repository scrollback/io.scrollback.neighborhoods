import React from "react-native";
import StateItem from "./StateItem";
import SearchableList from "./SearchableList";
import StatusbarContainer from "./StatusbarContainer";
import ListHeader from "./ListHeader";
import Colors from "../../Colors.json";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightGrey
	},
});

export default class StatesFiltered extends React.Component {
	static propTypes = {
		onDismiss: React.PropTypes.func.isRequired,
		getResults: React.PropTypes.func.isRequired,
		onSelectItem: React.PropTypes.func.isRequired,
	};

	_renderRow = state => {
		if (!state) {
			return null;
		}

		return (
			<StateItem
				key={state.id}
				state={state}
				onSelect={this.props.onSelectItem}
			/>
		);
	};

	_renderHeader = () => <ListHeader>States in India</ListHeader>;

	render() {
		return (
			<StatusbarContainer style={styles.container}>
				<SearchableList
					getResults={this.props.getResults}
					renderRow={this._renderRow}
					renderHeader={this._renderHeader}
					onDismiss={this.props.onDismiss}
					searchHint="Type a place to search"
				/>
			</StatusbarContainer>
		);
	}
}
