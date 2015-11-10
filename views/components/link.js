import React from "react-native";
import Linking from "../../modules/linking";

const {
	StyleSheet,
	Text
} = React;

const styles = StyleSheet.create({
	link: { color: "#2196F3" }
});

export default class Link extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.children !== nextProps.children ||
			this.props.href !== nextProps.href ||
			this.props.onOpen !== nextProps.onOpen
		);
	}

	openLink(link) {
		const event = {
			preventDefault() {
				this.defaultPrevented = true;
			},

			defaultPrevented: false,
			link
		};

		if (this.props.onOpen) {
			this.props.onOpen(event);
		}

		if (!event.defaultPrevented) {
			Linking.openURL(link);
		}
	}

	render() {
		return (
			<Text
				{...this.props}
				onPress={() => this.props.href ? this.openLink(this.props.href) : false}
				style={[ styles.link, this.props.style ]}
			>
					{this.props.children}
			</Text>
		);
	}
}

Link.propTypes = {
	children: React.PropTypes.string.isRequired,
	href: React.PropTypes.string,
	onOpen: React.PropTypes.func
};

Link.defaultProps = {
	href: ""
};
