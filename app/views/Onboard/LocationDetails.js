/* @flow */

import React from 'react-native';
import NextButton from './NextButton';
import StatusbarWrapper from '../StatusbarWrapper';
import OnboardTitle from './OnboardTitle';
import OnboardError from './OnboardError';
import PlaceManager from '../Account/PlaceManager';
import Modal from '../Modal';
import AppText from '../AppText';
import Colors from '../../../Colors.json';

const {
	ScrollView,
	StyleSheet,
	View,
	TouchableOpacity
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},

	inner: {
		padding: 16,
		alignItems: 'stretch',
		justifyContent: 'center'
	},

	places: {
		marginHorizontal: 8,
		height: 216,
	},

	skip: {
		margin: 16,
		fontSize: 12,
		textAlign: 'center',
		color: Colors.darkGrey,
		textDecorationColor: Colors.darkGrey,
		textDecorationStyle: 'solid',
		textDecorationLine: 'underline',
	},
});

export default class LocationDetails extends React.Component {
	static propTypes = {
		places: React.PropTypes.array.isRequired,
		error: React.PropTypes.object,
		isLoading: React.PropTypes.bool,
		isDisabled: React.PropTypes.bool,
		onComplete: React.PropTypes.func.isRequired,
		onChangePlace: React.PropTypes.func.isRequired,
		onSkip: React.PropTypes.func.isRequired
	};

	render() {
		return (
			<View style={styles.container}>
				<StatusbarWrapper />
				<ScrollView contentContainerStyle={[ styles.container, styles.inner ]}>
					<OnboardTitle>Pick neighborhoods to join</OnboardTitle>

					<PlaceManager
						style={styles.places}
						places={this.props.places}
						onChange={this.props.onChangePlace}
					/>

					{this.props.error ?
						<OnboardError message={this.props.error.message} /> :
						<TouchableOpacity onPress={this.props.onSkip}>
							<AppText style={styles.skip}>I'm not in Bangalore or Mumbai</AppText>
						</TouchableOpacity>
					}
				</ScrollView>
				<NextButton
					label="Get started"
					loading={this.props.isLoading}
					disabled={this.props.isDisabled}
					onPress={this.props.onComplete}
				/>
				<Modal />
			</View>
		);
	}
}

export default LocationDetails;
