/* @flow */

import React from "react-native";
import NextButton from "./NextButton";
import AppTextInput from "../AppTextInput";
import StatusbarContainer from "../StatusbarContainer";
import KeyboardSpacer from "../KeyboardSpacer";
import OnboardTitle from "./OnboardTitle";
import OnboardParagraph from "./OnboardParagraph";
import OnboardError from "./OnboardError";
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
		height: 96,
		width: 96,
		borderRadius: 48,
		backgroundColor: Colors.placeholder
	},

	inputContainer: {
		width: 200,
		marginHorizontal: 16,
	},
});

type Props = {
	error: Object;
	onComplete: Function;
	onChangeNick: Function;
	onChangeName: Function;
	nick: string;
	name: string;
	avatar: string;
	isLoading: boolean;
};

const UserDetails = (props: Props) => {
	const nick_color = props.error && props.error.field === "nick" ? Colors.error : Colors.placeholder;
	const name_color = props.error && props.error.field === "name" ? Colors.error : Colors.placeholder;

	return (
		<StatusbarContainer style={styles.container}>
			<ScrollView keyboardShouldPersistTaps contentContainerStyle={[ styles.container, styles.inner ]}>
				<OnboardTitle>Hey, Neighbor!</OnboardTitle>
				<View style={styles.avatarContainer}>
					<Image style={styles.avatar} source={{ uri: props.user ? props.user.picture : null }} />
				</View>
				<OnboardParagraph>What should we call you?</OnboardParagraph>

				<View style={styles.inputContainer}>
					<AppTextInput
						autoCorrect={false}
						maxLength={32}
						placeholder="Your ninja nickname"
						textAlign="center"
						underlineColorAndroid={nick_color}
						onChangeText={props.onChangeNick}
						value={props.nick}
					/>
					<AppTextInput
						placeholder="Your fabulous fullname"
						textAlign="center"
						underlineColorAndroid={name_color}
						onChangeText={props.onChangeName}
						value={props.name}
					/>
				</View>

				<OnboardError
					hint="People on Hey, Neighbor! will know you by your nickname."
					message={props.error ? props.error.message : null}
				/>
				<KeyboardSpacer />
			</ScrollView>
			<NextButton
				label="Sign up"
				loading={props.isLoading}
				onPress={props.onComplete}
			/>
			{Platform.Version >= VersionCodes.KITKAT ?
				<KeyboardSpacer /> :
				null // Android seems to Pan the screen on < Kitkat
			}
		</StatusbarContainer>
	);
};

UserDetails.propTypes = {
	onComplete: React.PropTypes.func.isRequired,
	onChangeNick: React.PropTypes.func.isRequired,
	onChangeName: React.PropTypes.func.isRequired,
	nick: React.PropTypes.string,
	name: React.PropTypes.string,
	user: React.PropTypes.shape({
		picture: React.PropTypes.string
	}),
	error: React.PropTypes.object,
	isLoading: React.PropTypes.bool
};

export default UserDetails;
