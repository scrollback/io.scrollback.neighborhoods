/* @flow */

import React from "react-native";
import AppText from "../AppText";
import Colors from "../../../Colors.json";

const {
	StyleSheet,
} = React;

const styles = StyleSheet.create({
	hint: {
		height: 36,
		color: Colors.grey,
		textAlign: "center",
		fontSize: 12,
		lineHeight: 18,
		marginVertical: 16,
	},

	error: {
		color: Colors.error
	},
});

type Props = {
	message: string;
	hint: string;
};

export default class OnboardError extends React.Component {
	props: Props;

	render() {
		const message = this.props.message || this.props.hint || "";

		return (
			<AppText style={[ styles.hint, this.props.message ? styles.error : null ]}>
				{message}
			</AppText>
		);
	}
}

OnboardError.propTypes = {
	message: React.PropTypes.string,
	hint: React.PropTypes.string
};
