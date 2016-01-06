import React from "react-native";
import Card from "./Card";
import CardTitle from "./CardTitle";
import DiscussionSummary from "./DiscussionSummary";
import CardAuthor from "./CardAuthor";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	details: {
		paddingVertical: 12,
		marginVertical: 0
	},

	title: {
		marginBottom: 8,
		marginHorizontal: 16
	},

	author: {
		marginTop: 8,
		marginHorizontal: 16
	}
});

const DiscussionDetailsCard = props => {
	const {
		thread
	} = props;

	return (
		<Card style={styles.details}>
			<CardTitle style={styles.title}>{thread.title}</CardTitle>
			<DiscussionSummary text={thread.text} />
			<CardAuthor nick={thread.from} style={styles.author} />
		</Card>
	);
};

DiscussionDetailsCard.propTypes = {
	thread: React.PropTypes.shape({
		text: React.PropTypes.string.isRequired
	}).isRequired
};

export default DiscussionDetailsCard;
