import React from 'react-native';
import AppText from './AppText';
import StatusbarWrapper from './StatusbarWrapper';
import Linking from '../modules/Linking';
import Colors from '../../Colors.json';

const {
	View,
	StyleSheet,
	TouchableOpacity,
} = React;

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.primary,
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},

	title: {
		color: Colors.white,
		fontWeight: 'bold',
		fontSize: 18,
		lineHeight: 27,
		textAlign: 'center',
	},

	belong: {
		fontSize: 24,
		lineHeight: 36,
	},

	header: {
		alignItems: 'center',
		justifyContent: 'center',
		margin: 8,
	},

	summary: {
		color: Colors.white,
		textAlign: 'center',
		margin: 8,
	},

	button: {
		margin: 16,
		paddingHorizontal: 24,
		paddingVertical: 12,
		borderRadius: 2,
		backgroundColor: Colors.accent,
		elevation: 4,
	},

	label: {
		color: Colors.fadedBlack,
		fontWeight: 'bold',
		fontSize: 12,
		lineHeight: 18,
	}
});

export default class UpgradeBanner extends React.Component {
	_handlePress() {
		Linking.openURL('https://play.google.com/store/apps/details?id=chat.belong.hello');
	}

	render() {
		return (
			<View style={styles.container}>
				<StatusbarWrapper />
				<View style={styles.header}>
					<AppText style={styles.title}>Hey, Neighbor!</AppText>
					<AppText style={styles.summary}>is now</AppText>
					<AppText style={[ styles.title, styles.belong ]}>Belong</AppText>
				</View>
				<AppText style={styles.summary}>Along with locality rooms, Belong will enable you to join your apartment and neighborhood groups as well!</AppText>
				<TouchableOpacity style={styles.button} onPress={this._handlePress}>
					<AppText style={styles.label}>TAKE ME WHERE I BELONG</AppText>
				</TouchableOpacity>
			</View>
		);
	}
}
