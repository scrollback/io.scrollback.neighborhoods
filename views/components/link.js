import React from "react-native";
import Colors from "../../colors.json";
import Linking from "../../modules/linking";

const {
	StyleSheet,
	Text
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
			<Text
				{...this.props}
				onPress={this._onPress.bind(this)}
				style={[ styles.link, this.props.style ]}
			>
				{this.props.children}
			</Text>
		);
	}
}

Link.buildLink = link => {
	if (/^((https?|ftp):\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})(:[0-9]{1,4})?([\/\w \.-]*)*\/?$/i.test(link)) {
		// a normal link
		return /^(https?|ftp):\/\//i.test(link) ? link : "http://" + link;
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

Link.propTypes = {
	children: React.PropTypes.string.isRequired,
	url: React.PropTypes.string,
	onPress: React.PropTypes.func,
	onOpen: React.PropTypes.func
};

Link.defaultProps = {
	url: "#"
};
