import React from "react-native";
import CardSummary from "./CardSummary";
import Embed from "./Embed";
import Link from "./Link";
import textUtils from "../lib/text-utils";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	image: {
		marginVertical: 4,
		height: 180,
		width: null
	},
	item: {
		marginHorizontal: 16
	}
});

const DiscussionSummary = props => {
	const trimmedText = props.text.trim();

	const links = Link.parseLinks(trimmedText, 1);
	const metadata = textUtils.getMetadata(trimmedText);

	let cover, hideSummary;

	if (metadata && metadata.type === "photo") {
		cover = (
			<Embed
				url={metadata.url}
				data={metadata}
				thumbnailStyle={styles.image}
				showTitle={false}
				showSummary={false}
			/>
		);

		hideSummary = true;
	} else if (links.length) {
		cover = (
			<Embed
				url={links[0]}
				thumbnailStyle={styles.image}
				showTitle={false}
				showSummary={false}
			/>
		);
	}

	return (
		<View {...props}>
			{cover}

			{hideSummary ? null :
				<CardSummary style={styles.item} text={trimmedText} />
			}
		</View>
	);
};

DiscussionSummary.propTypes = {
	text: React.PropTypes.string.isRequired
};

export default DiscussionSummary;
