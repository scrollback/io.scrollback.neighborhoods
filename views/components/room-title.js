import React from "react-native";

const {
	StyleSheet,
	Text
} = React;

const styles = StyleSheet.create({
	title: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 18,
		marginVertical: 14,
		marginRight: 64,
		paddingHorizontal: 4
	}
});

export default class RoomTitle extends React.Component {
	render() {
		return (
			<Text numberOfLines={1} style={styles.title}>
				{this.props.room.guides.displayName}
			</Text>
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
