import React from "react-native";
import Colors from "../../colors.json";
import AppText from "./app-text";
import Icon from "./icon";
import CardAuthor from "./card-author";
import timeUtils from "../../lib/time-utils";

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	footer: {
		flexDirection: "row",
		marginTop: 6
	},
	left: {
		flex: 1
	},
	right: {
		flexDirection: "row",
		justifyContent: "flex-end"
	},
	info: {
		flexDirection: "row",
		alignItems: "center"
	},
	label: {
		color: Colors.black,
		fontSize: 12,
		lineHeight: 18,
		marginLeft: 8,
		marginRight: 16,
		paddingHorizontal: 4
	},
	action: {
		fontWeight: "bold"
	},
	icon: {
		color: Colors.black
	},
	faded: {
		opacity: 0.3
	}
});

export default class DiscussionFooter extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.thread.updateTime !== nextProps.thread.updateTime ||
			this.props.thread.length !== nextProps.thread.length
		);
	}

	render() {
		return (
			<View {...this.props} style={[ styles.footer, this.props.style ]}>
				<CardAuthor nick={this.props.thread.from} style={styles.left} />

				<View style={styles.right}>
					<View style={[ styles.info, styles.faded ]}>
						<Icon
							name="access-time"
							style={styles.icon}
							size={24}
						/>
						<AppText style={styles.label}>{timeUtils.short(this.props.thread.updateTime)}</AppText>
					</View>
					<View style={[ styles.info, styles.faded ]}>
						<Icon
							name="forum"
							style={styles.icon}
							size={24}
						/>
						<AppText style={styles.label}>{this.props.thread.length || 1}</AppText>
					</View>
				</View>
			</View>
		);
	}
}

DiscussionFooter.propTypes = {
	thread: React.PropTypes.shape({
		updateTime: React.PropTypes.number.isRequired,
		length: React.PropTypes.number.isRequired,
		from: React.PropTypes.string.isRequired
	}).isRequired
};
