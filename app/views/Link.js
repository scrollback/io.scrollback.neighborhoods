import React from "react-native";
import Colors from "../../Colors.json";
import Linking from "../modules/Linking";
import AppText from "./AppText";

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

	_openLink = url => {
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
	};

	_handlePress = e => {
		if (this.props.onPress) {
			this.props.onPress(e);
		}

		this._openLink(this.props.url);
	};

	render() {
		return (
			<AppText
				{...this.props}
				onPress={this._handlePress}
				style={[ styles.link, this.props.style ]}
			>
				{this.props.children}
			</AppText>
		);
	}
}

Link.propTypes = {
	children: React.PropTypes.string.isRequired,
	url: React.PropTypes.string,
	onPress: React.PropTypes.func,
	onOpen: React.PropTypes.func,
	style: AppText.propTypes.style,
};

Link.defaultProps = {
	url: "#"
};
