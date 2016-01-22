import React from "react-native";
import LocalityItemContainer from "../containers/LocalityItemContainer";
import SearchableList from "./SearchableList";
import StatusbarContainer from "./StatusbarContainer";
import Colors from "../../Colors.json";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.lightGrey
	},
	inner: {
		flex: 1
	}
});

export default class LocalitiesFiltered extends React.Component {
	static propTypes = {
		onDismiss: React.PropTypes.func.isRequired,
		getResults: React.PropTypes.func.isRequired,
		onSelectLocality: React.PropTypes.func.isRequired,
	};

	_renderRow = room => {
		if (!room) {
			return null;
		}

		return (
			<LocalityItemContainer
				key={room.id}
				room={room}
				onSelect={this.props.onSelectLocality}
				showMenuButton={false}
				showBadge={false}
			/>
		);
	};

	render() {
		return (
			<StatusbarContainer style={styles.container}>
				<SearchableList
					getResults={this.props.getResults}
					renderRow={this._renderRow}
					onDismiss={this.props.onDismiss}
					searchHint="Type a place to search"
				/>
			</StatusbarContainer>
		);
	}
}
