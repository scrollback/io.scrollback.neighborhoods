import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import AvatarRound from "./AvatarRound";
import TouchFeedback from "./TouchFeedback";

const {
	StyleSheet,
	PixelRatio,
	View
} = React;

const styles = StyleSheet.create({
	item: {
		backgroundColor: Colors.white,
		borderColor: Colors.separator,
		borderBottomWidth: 1 / PixelRatio.get()
	},
	person: {
		flexDirection: "row",
		alignItems: "center"
	},
	avatar: {
		marginHorizontal: 16,
		marginVertical: 12
	},
	nick: {
		flex: 1
	},
	nickText: {
		color: Colors.darkGrey
	},
	status: {
		fontSize: 12,
		lineHeight: 18,
		marginHorizontal: 16,
		paddingHorizontal: 4,
		color: Colors.darkGrey
	},
	online: {
		color: Colors.success,
		fontWeight: "bold"
	},
	offline: {
		opacity: 0.5
	}
});

export default class PeopleListItem extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (
			this.props.user.id !== nextProps.user.id ||
			this.props.user.status !== nextProps.user.status
		);
	}

	render() {
		const {
			user: {
				id,
				status
			}
		} = this.props;

		return (
			<View style={styles.item}>
				<TouchFeedback>
					<View style={styles.person}>
						<AvatarRound
							style={styles.avatar}
							size={36}
							nick={id}
						/>
						<View style={styles.nick}>
							<AppText style={[ styles.nickText, status !== "online" ? styles.offline : null ]}>
								{id}
							</AppText>
						</View>
						<View>
							<AppText style={[ styles.status, status === "online" ? styles.online : styles.offline ]}>
								{status ? status.toUpperCase() : "OFFLINE"}
							</AppText>
						</View>
					</View>
				</TouchFeedback>
			</View>
		);
	}
}

PeopleListItem.propTypes = {
	user: React.PropTypes.shape({
		id: React.PropTypes.string.isRequired,
		status: React.PropTypes.string
	}).isRequired
};
