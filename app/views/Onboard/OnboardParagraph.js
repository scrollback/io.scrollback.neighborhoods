/* @flow */

import React from "react-native";
import AppText from "../AppText";
import Colors from "../../../Colors.json";

const {
	StyleSheet,
} = React;

const styles = StyleSheet.create({
	paragraph: {
		color: Colors.darkGrey,
		fontSize: 16,
		lineHeight: 24,
		textAlign: "center",
		margin: 16,
	},
});

type Props = {
	children: ReactElement;
	style?: any;
}

const OnboardParagraph = (props: Props) => <AppText style={[ styles.paragraph, props.style ]}>{props.children}</AppText>;

OnboardParagraph.propTypes = {
	children: React.PropTypes.node.isRequired
};

export default OnboardParagraph;
