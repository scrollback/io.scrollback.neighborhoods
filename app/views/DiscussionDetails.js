import React from "react-native";
import PageEmpty from "./PageEmpty";
import PageLoading from "./PageLoading";
import DiscussionDetailsCard from "./DiscussionDetailsCard";
import PeopleListContainer from "../containers/PeopleListContainer";

const {
	ScrollView
} = React;

const DiscussionDetails = props => {
	if (props.thread === "missing") {
		return <PageLoading />;
	} else if (typeof props.thread === "object") {
		return (
			<ScrollView {...props}>
				<DiscussionDetailsCard thread={props.thread} />
				<PeopleListContainer thread={props.thread} />
			</ScrollView>
		);
	} else {
		return <PageEmpty label="Failed to load discussion" image="sad" />;
	}
};

DiscussionDetails.propTypes = {
	thread: React.PropTypes.oneOfType([
		React.PropTypes.oneOf([ "missing", "failed" ]),
		React.PropTypes.object
	])
};

export default DiscussionDetails;
