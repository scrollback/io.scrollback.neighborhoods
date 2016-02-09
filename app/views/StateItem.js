import React from 'react-native';
import Colors from '../../Colors.json';
import AppText from './AppText';
import ListItem from './ListItem';

const {
	StyleSheet,
} = React;

const styles = StyleSheet.create({
	item: {
		color: Colors.darkGrey,
		fontWeight: 'bold',
		marginHorizontal: 16
	}
});

export default class StateItem extends React.Component {
	_handlePress = () => {
		if (this.props.onSelect) {
			this.props.onSelect(this.props.state);
		}
	};

	render() {
		const { state } = this.props;

		return (
			<ListItem
				{...this.props}
				onPress={this._handlePress}
			>
				<AppText style={styles.item}>{state.guides.displayName}</AppText>
			</ListItem>
		);
	}
}

StateItem.propTypes = {
	state: React.PropTypes.shape({
		guides: React.PropTypes.shape({
			displayName: React.PropTypes.string.isRequired
		}).isRequired,
	}),
	onSelect: React.PropTypes.func,
};
