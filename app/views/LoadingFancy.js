import React from 'react-native';
import Colors from '../../Colors.json';
import Loading from './Loading';

const {
	StyleSheet,
	PixelRatio,
	View
} = React;

const styles = StyleSheet.create({
	container: {
		backgroundColor: Colors.white,
		borderColor: Colors.separator,
		borderWidth: 1 / PixelRatio.get(),
		height: 36,
		width: 36,
		borderRadius: 18,
		alignItems: 'center',
		justifyContent: 'center',
		margin: 24,
		elevation: 1
	},

	loading: {
		height: 24,
		width: 24
	}
});

export default class LoadingItem extends React.Component {
	render() {
		return (
			<View style={[ styles.container, this.props.style ]}>
				<Loading style={styles.loading} />
			</View>
		);
	}
}
