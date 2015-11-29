import React from "react-native";
import Colors from "../../colors.json";
import AppText from "./app-text";

const {
	StyleSheet
} = React;

const styles = StyleSheet.create({
	title: {
		color: Colors.white,
		fontWeight: "bold",
		fontSize: 18,
		lineHeight: 27,
		marginVertical: 14,
		marginRight: 64,
		paddingHorizontal: 4
	}
});

export default class RoomTitle extends React.Component {
	shouldComponentUpdate(nextProps) {
		return this.props.room.guides.displayName !== nextProps.room.guides.displayName;
	}

	render() {
		return (
			<AppText numberOfLines={1} style={styles.title}>
				{this.props.room.guides.displayName}
			</AppText>
		);
	}
}

RoomTitle.propTypes = {
	room: React.PropTypes.shape({
		guides: React.PropTypes.shape({
			displayName: React.PropTypes.string.isRequired
		})
	}).isRequired
};
