import React from 'react-native';
import AppText from './AppText';
import Colors from '../../Colors.json';
import config from '../store/config';

const {
	StyleSheet,
	View,
} = React;

const styles = StyleSheet.create({
	banner: {
		backgroundColor: Colors.info,
		padding: 16
	},

	bannerText: {
		color: Colors.white
	}
});

export default class extends React.Component {
	render() {
		return (
			<View style={styles.banner}>
				<AppText style={styles.bannerText}>
					{config.app_name} is yet to launch in your neighborhood. Meanwhile join the open house and connect with Neighbors from all around.
				</AppText>
			</View>
		);
	}
}
