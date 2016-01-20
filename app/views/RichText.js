import React from "react-native";
import AppText from "./AppText";
import Link from "./Link";
import smiley from "../lib/smiley";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	emojiOnly: {
		textAlign: "center",
		fontSize: 32,
		lineHeight: 48
	}
});

export default class RichText extends React.Component {
	shouldComponentUpdate(nextProps) {
		return this.props.text !== nextProps.text;
	}

	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	render() {
		const { onOpenLink } = this.props;

		const textWithEmoji = smiley.format(this.props.text);

		if (smiley.isEmoji(textWithEmoji)) {
			return (
				<AppText
					{...this.props}
					style={[ styles.emojiOnly, this.props.style ]}
					ref={c => this._root = c}
				>
					{textWithEmoji}
				</AppText>
			);
		} else {
			return (
				<AppText
					{...this.props}
					style={[ styles.text, this.props.style ]}
					ref={c => this._root = c}
				>
					{textWithEmoji.split("\n").map((text, index, arr) => {
						return ([
							text.split(" ").map((inner, i) => {
								let t = inner;

								const items = [];

								const key = "inner-" + index + "-" + i;

								// Strip out ending punctuations
								let punctuation = "";

								const matches = t.match(/[\.,\?!:;]+$/);

								if (matches) {
									punctuation = matches[0];
									t = t.substring(0, t.length - punctuation.length);
								}

								if (/^@[a-z0-9\-]{3,}$/.test(t)) {
									// a mention
									items.push(<Link onOpen={onOpenLink} key={key}>{t}</Link>);
								} else if (/^#\S{2,}$/.test(t)) {
									// a hashtag
									items.push(<Link onOpen={onOpenLink} key={key}>{t}</Link>);
								} else {
									const url = Link.buildLink(t);

									if (url !== null) {
										items.push(
											<Link
												onOpen={onOpenLink}
												key={key}
												url={url}
											>
												{t}
											</Link>
										);
									} else {
										return t + punctuation + " ";
									}
								}

								items.push(punctuation + " ");

								return items;
							}),
							index !== (arr.length - 1) ? "\n" : ""
						]);
					})}
				</AppText>
			);
		}
	}
}

RichText.propTypes = {
	text: React.PropTypes.string.isRequired,
	onOpenLink: React.PropTypes.func
};
