import React from 'react-native';

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	page: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	}
});

const Page = props => (
	<View style={[ styles.page, props.style ]}>
		{props.children}
	</View>
);

Page.propTypes = {
	children: React.PropTypes.node.isRequired
};

export default Page;
