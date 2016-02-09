/* @flow */

import React from 'react-native';
import AppText from '../AppText';
import Icon from '../Icon';
import Colors from '../../../Colors.json';

const {
	View,
	StyleSheet
} = React;

const styles = StyleSheet.create({
	label: {
		color: Colors.white,
		fontWeight: 'bold',
		margin: 16
	},

	icon: {
		color: Colors.fadedBlack
	}
});

export default class NextButtonLabel extends React.Component {
	static propTypes = {
		label: React.PropTypes.string,
		style: View.propTypes.style
	};

	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		return (
			<View {...this.props} ref={c => this._root = c}>
				<AppText style={styles.label}>{this.props.label.toUpperCase()}</AppText>
				<Icon
					style={styles.icon}
					name="arrow-forward"
					size={16}
				/>
			</View>
		);
	}
}

export default NextButtonLabel;
