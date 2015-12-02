import React from "react-native";
import Colors from "../../colors.json";
import Linking from "../../modules/linking";
import AppText from "./app-text";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	link: {
		color: Colors.info
	}
});

export default class Link extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.children !== nextProps.children ||
			this.props.url !== nextProps.url ||
			this.props.onOpen !== nextProps.onOpen
		);
	}

	_openLink(url) {
		const event = {
			preventDefault() {
				this.defaultPrevented = true;
			},

			defaultPrevented: false,
			url
		};

		if (this.props.onOpen) {
			this.props.onOpen(event);
		}

		if (/^#/.test(url)) {
			return;
		}

		if (!event.defaultPrevented) {
			Linking.openURL(url);
		}
	}

	_onPress(e) {
		if (this.props.onPress) {
			this.props.onPress(e);
		}

		this._openLink(this.props.url);
	}

	render() {
		return (
			<AppText
				{...this.props}
				onPress={this._onPress.bind(this)}
				style={[ styles.link, this.props.style ]}
			>
				{this.props.children}
			</AppText>
		);
	}
}

Link.buildLink = link => {
	if (/^((https?|ftp):\/\/.)?(www\.)?([-a-zA-Z0-9@:%\._\+~#=]){2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/.test(link) && !/\.{2,}/.test(link)) {
		// a normal link
		return /^(https?|ftp):\/\//.test(link) ? link : "http://" + link;
	}

	if (/^(mailto:)?[^@]+@[^@]+\.[^@]+$/i.test(link)) {
		// an email id
		return /^mailto:/.test(link) ? link : "mailto:" + link;
	}

	if (/^(tel:)?(?:\+?(\d{1,3}))?[-.\s(]*(\d{3})?[-.\s)]*(\d{3})[-.\s]*(\d{4})(?: *x(\d+))?$/.test(link)) {
		// a phone number
		return /^tel:/.test(link) ? link : "tel:" + link;
	}

	return null;
};

Link.parseLinks = (text, count) => {
	const links = [];
	const words = text.replace(/(\r\n|\n|\r)/g, " ").split(" ");

	let url;

	for (let i = 0, l = words.length; i < l; i++) {
		url = Link.buildLink(words[i].replace(/[\.,\?!:;]+$/, ""));

		if (/^https?:\/\//.test(url)) {
			links.push(url);

			if (count && links.length >= count) {
				break;
			}
		}
	}

	return links;
};

Link.propTypes = {
	children: React.PropTypes.string.isRequired,
	url: React.PropTypes.string,
	onPress: React.PropTypes.func,
	onOpen: React.PropTypes.func
};

Link.defaultProps = {
	url: "#"
};
