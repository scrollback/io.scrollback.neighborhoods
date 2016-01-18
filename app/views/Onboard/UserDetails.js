/* @flow */

import React from "react-native";
import NextButton from "./NextButton";
import AppText from "../AppText";
import AppTextInput from "../AppTextInput";
import StatusbarContainer from "../StatusbarContainer";
import KeyboardSpacer from "../KeyboardSpacer";
import Banner from "../Banner";
import OnboardTitle from "./OnboardTitle";
import OnboardParagraph from "./OnboardParagraph";
import VersionCodes from "../../modules/VersionCodes";
import Colors from "../../../Colors.json";

const {
	View,
	ScrollView,
	Image,
	StyleSheet,
	Platform,
} = React;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white
	},

	inner: {
		padding: 15,
		alignItems: "center",
		justifyContent: "center"
	},

	avatar: {
		height: 96,
		width: 96,
		borderRadius: 48
	},

	avatarContainer: {
		margin: 16,
		borderRadius: 48
	},

	inputContainer: {
		width: 200,
		marginHorizontal: 16,
		marginVertical: 8,
	},

	hint: {
		color: Colors.grey,
		textAlign: "center",
		fontSize: 12,
		lineHeight: 18,
		marginVertical: 16,
	},

	error: {
		color: Colors.error
	},

	icon: {
		color: Colors.fadedBlack
	},
});

const ERROR_MESSAGES = {
	VALIDATE_CHARS: "",
	VALIDATE_START: "",
	VALIDATE_ONLY_NUMS: "",
	VALIDATE_LENGTH_SHORT: ""
};

type Props = {
	errorMessage: string;
	validationError: any;
	onComplete: Function;
	onEnterNick: Function;
	onEnterName: Function;
	nick: string;
	name: string;
	avatar: string;
};

const UserDetails = (props: Props) => (
	<StatusbarContainer style={styles.container}>
		<Banner text={props.errorMessage} type="error" />

		<ScrollView keyboardShouldPersistTaps contentContainerStyle={[ styles.container, styles.inner ]}>
			<OnboardTitle>Hey, Neighbor!</OnboardTitle>
			<View style={styles.avatarContainer}>
				<Image style={styles.avatar} source={{ uri: props.avatar }} />
			</View>
			<OnboardParagraph>Welcome to your neighborhood. What should we call you?</OnboardParagraph>

			<View style={styles.inputContainer}>
				<AppTextInput
					autoCorrect={false}
					maxLength={32}
					placeholder="Your ninja nickname"
					textAlign="center"
					underlineColorAndroid={Colors.placeholder}
					onChangeText={props.onEnterNick}
					value={props.nick}
				/>
				<AppTextInput
					placeholder="Your fabulous fullname"
					textAlign="center"
					underlineColorAndroid={Colors.placeholder}
					onChangeText={props.onEnterName}
					value={props.name}
				/>
			</View>

			<AppText style={styles.hint}>
				{ERROR_MESSAGES[props.validationError] || "People on Hey, Neighbor! will know you by your nick name."}
			</AppText>
			<KeyboardSpacer />
		</ScrollView>
		<NextButton label="Sign up" onPress={props.onComplete} />
		{Platform.Version >= VersionCodes.KITKAT ?
			<KeyboardSpacer /> :
			null // Android seems to Pan the screen on < Kitkat
		}
	</StatusbarContainer>
);

UserDetails.propTypes = {
	errorMessage: React.PropTypes.string,
	validationError: React.PropTypes.objectOf(React.PropTypes.string),
	onComplete: React.PropTypes.func.isRequired,
	onEnterNick: React.PropTypes.func.isRequired,
	onEnterName: React.PropTypes.func.isRequired,
	nick: React.PropTypes.string,
	name: React.PropTypes.string,
	avatar: React.PropTypes.string
};

export default UserDetails;
