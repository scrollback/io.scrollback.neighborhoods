import React from 'react-native';
import Colors from '../../Colors.json';
import Icon from './Icon';

const {
	StyleSheet,
	TouchableHighlight,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		right: 16,
		bottom: 16,
		height: 56,
		width: 56,
		borderRadius: 28,
		elevation: 6
	},
	fab: {
		backgroundColor: Colors.accent,
		height: 56,
		width: 56,
		borderRadius: 28
	},
	icon: {
		margin: 16,
		color: Colors.fadedBlack
	}
});

export default class FloatingActionButton extends React.Component {
	render() {
		return (
			<TouchableHighlight {...this.props} style={styles.container}>
				<View style={styles.fab}>
					<Icon
						name={this.props.icon}
						style={styles.icon}
						size={24}
					/>
				</View>
			</TouchableHighlight>
		);
	}
}

FloatingActionButton.propTypes = {
	icon: React.PropTypes.string.isRequired
};
