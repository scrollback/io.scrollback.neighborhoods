import React from 'react-native';
import Colors from '../../Colors.json';
import AvatarContainer from '../containers/AvatarContainer';

const {
	StyleSheet,
	View
} = React;

const styles = StyleSheet.create({
	avatar: {
		backgroundColor: Colors.placeholder
	},
	image: {
		flex: 1,
		resizeMode: 'cover'
	}
});

export default class AvatarRound extends React.Component {
	shouldComponentUpdate(nextProps) {
		return (this.props.size !== nextProps.size || this.props.nick !== nextProps.nick);
	}

	render() {
		const { size } = this.props;

		return (
			<View {...this.props} style={[ styles.avatar, { height: size, width: size, borderRadius: size / 2 }, this.props.style ]}>
				<AvatarContainer
					size={this.props.size}
					nick={this.props.nick}
					style={[ styles.image, { borderRadius: size / 2 } ]}
				/>
			</View>
		);
	}
}

AvatarRound.propTypes = {
	size: React.PropTypes.number.isRequired,
	nick: React.PropTypes.string.isRequired
};
