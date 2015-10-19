import React from "react-native";
import Link from "./link";
import smiley from "../../lib/smiley";

const {
	StyleSheet,
	Text
} = React;

const styles = StyleSheet.create({
	text: {
		fontSize: 14,
		lineHeight: 21
	},
	emojiOnly: {
		textAlign: "center",
		fontSize: 32,
		lineHeight: 48
	}
});

export default class RichText extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (this.props.text !== nextProps.text);
	}

	render() {
		const textWithEmoji = smiley.format(this.props.text.trim());

		if (/^([\uD800-\uDBFF][\uDC00-\uDFFF])$/gi.test(textWithEmoji)) {
			return <Text {...this.props} style={[ styles.emojiOnly, this.props.style ]}>{textWithEmoji}</Text>;
		} else {
			return (
				<Text {...this.props} style={[ styles.text, this.props.style ]}>
					{textWithEmoji.split("\n").map((text, index, arr) => {
						return ([
							text.split(" ").map((inner, i) => {
								let t = inner;

								const items = [];

								const key = "inner-" + index + "-" + i;

								// Strip out ending punctuations
								let punctuation = "";

								if (/[\.,\?!:;]$/.test(t)) {
									punctuation = t.substring(t.length - 1);

									t = t.replace(/.$/, "");
								}

								if (/^@[a-z0-9\-]+$/.test(t)) {
									// a mention
									items.push(<Link key={key}>{t}</Link>);
								} else if (/^#\S+$/.test(t)) {
									// a hashtag
									items.push(<Link key={key}>{t}</Link>);
								} else if (/^(http|https):\/\/(\S+)$/i.test(t)) {
									// a link
									items.push(<Link key={key} href={t}>{t}</Link>);
								} else if (/^[^@]+@[^@]+\.[^@]+$/i.test(t)) {
									// an email id
									items.push(<Link key={key} href={"mailto:" + t}>{t}</Link>);
								} else if (/^(?:\+?(\d{1,3}))?[-.\s(]*(\d{3})?[-.\s)]*(\d{3})[-.\s]*(\d{4})(?: *x(\d+))?$/.test(t)) {
									// a phone number
									items.push(<Link key={key} href={"tel:" + t}>{t}</Link>);
								} else {
									return t + punctuation + " ";
								}

								items.push(punctuation + " ");

								return items;
							}),
							index !== (arr.length - 1) ? "\n" : ""
						]);
					})}
				</Text>
			);
		}
	}
}

RichText.propTypes = {
	text: React.PropTypes.string.isRequired
};
