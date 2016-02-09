import React from 'react-native';
import Colors from '../../Colors.json';
import AppText from './AppText';
import AvatarRound from './AvatarRound';

const {
	StyleSheet,
	PixelRatio,
	TouchableHighlight,
	ScrollView,
	View
} = React;

const styles = StyleSheet.create({
	inverted: {
		transform: [
			{ scaleY: -1 }
		]
	},
	item: {
		backgroundColor: Colors.white,
		borderColor: Colors.separator,
		borderTopWidth: 1 / PixelRatio.get(),
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 16,
		height: 40
	},
	nick: {
		color: Colors.darkGrey,
		marginHorizontal: 12,
		paddingHorizontal: 4
	}
});

export default class ChatSuggestions extends React.Component {
	render() {
		const { data } = this.props;

		if (!data.length) {
			return null;
		}

		return (
			<ScrollView
				{...this.props}
				style={[ data.length > 4 ? { height: 160 } : null, styles.inverted, this.props.style ]}
				keyboardShouldPersistTaps
			>
				{data.map(nick => {
					return (
						<TouchableHighlight
							key={nick}
							underlayColor={Colors.underlay}
							onPress={() => this.props.onSelect(nick)}
						>
							<View style={[ styles.item, styles.inverted ]}>
								<AvatarRound
									nick={nick}
									size={24}
								/>
								<AppText style={styles.nick}>{nick}</AppText>
							</View>
						</TouchableHighlight>
					);
				})}
			</ScrollView>
		);
	}
}

ChatSuggestions.propTypes = {
	data: React.PropTypes.arrayOf(React.PropTypes.string),
	onSelect: React.PropTypes.func.isRequired
};
