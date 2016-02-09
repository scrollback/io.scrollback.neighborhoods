/* @flow */

import React from 'react-native';
import NextButton from './NextButton';
import StatusbarWrapper from '../StatusbarWrapper';
import OnboardTitle from './OnboardTitle';
import OnboardParagraph from './OnboardParagraph';
import Colors from '../../../Colors.json';

const {
	View,
	StyleSheet,
	Image,
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},

	inner: {
		padding: 15,
		alignItems: 'center',
		justifyContent: 'center',
	},

	text: {
		marginVertical: 8,
	},

	image: {
		margin: 8,
	},
});

const UserDetails = (props: { onComplete: Function }) => (
	<View style={styles.container}>
		<StatusbarWrapper />
		<View style={[ styles.container, styles.inner ]}>
			<OnboardTitle style={styles.text}>
				{
					props.isSkipped ?
					'Join the Open House' :
					'You are all set!'
				}
			</OnboardTitle>
			<Image style={styles.image} source={require('../../../assets/open-door.png')} />
			<OnboardParagraph style={styles.text}>
				{
					props.isSkipped ?
					'We are coming to your city soon! Stay connected by joining the open house group.' :
					'Have fun and help make your neighbourhood better.'
				}
			</OnboardParagraph>
		</View>
		<NextButton label="Let's go" onPress={props.onComplete} />
	</View>
);

UserDetails.propTypes = {
	onComplete: React.PropTypes.func.isRequired,
	isSkipped: React.PropTypes.bool
};

export default UserDetails;
