import React from "react-native";
import PeopleListContainer from "../containers/PeopleListContainer";
import Card from "./Card";
import CardTitle from "./CardTitle";
import DiscussionSummary from "./DiscussionSummary";
import CardAuthor from "./CardAuthor";
import ListHeader from "./ListHeader";

const {
	ScrollView,
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

const DiscussionDetails = props => {
	const {
		thread,
		navigator
	} = props;

	return (
		<ScrollView {...props}>
			<Card style={styles.details}>
				<CardTitle style={styles.title}>{thread.title}</CardTitle>
				<DiscussionSummary text={thread.text} />
				<CardAuthor nick={thread.from} style={styles.author} />
			</Card>
			<ListHeader>People talking</ListHeader>
			<PeopleListContainer thread={thread.id} navigator={navigator} />
		</ScrollView>
	);
};

DiscussionDetails.propTypes = {
	thread: React.PropTypes.shape({
		text: React.PropTypes.string.isRequired
	}).isRequired,

	navigator: React.PropTypes.object.isRequired
};

export default DiscussionDetails;
