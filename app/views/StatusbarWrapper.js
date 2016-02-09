import React from 'react-native';
import VersionCodes from '../modules/VersionCodes';

const {
	Platform,
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	statusbar: {
		height: Platform.OS === 'android' ? 25 : 20 // offset for statusbar height
	}
});

const StatusbarWrapper = props => <View style={[ styles.statusbar, props.style ]} />;

StatusbarWrapper.propTypes = {
	style: View.propTypes.style
};

// Versions below KitKat don't have translucent statusbar
export default Platform.OS === 'android' && Platform.Version < VersionCodes.KITKAT ? View : StatusbarWrapper;
