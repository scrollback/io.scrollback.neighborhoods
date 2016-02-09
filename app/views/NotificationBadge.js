import React from 'react-native';
import Colors from '../../Colors.json';
import AppText from './AppText';

const {
	StyleSheet,
	Animated,
	View
} = React;

const styles = StyleSheet.create({
	badge: {
		height: 24,
		width: 24,
		borderRadius: 12,
		paddingVertical: 4,
		backgroundColor: Colors.fadedBlack
	},
	count: {
		color: Colors.white,
		fontWeight: 'bold',
		fontSize: 10,
		lineHeight: 15,
		textAlign: 'center'
	}
});

export default class NotificationBadge extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			scaleAnim: new Animated.Value(0)
		};
	}

	componentDidMount() {
		if (this.props.count > 0) {
			this._scaleIn();
		}
	}

	shouldComponentUpdate(nextProps) {
		return (this.props.count !== nextProps.count);
	}

	componentWillUpdate(nextProps) {
		if (nextProps.count > 0) {
			if (this.props.count === 0) {
				this._scaleIn();
			} else {
				this._bounce();
			}
		} else {
			if (this.props.count > 0) {
				this._scaleOut();
			}
		}
	}

	_bounce = () => {
		Animated.timing(this.state.scaleAnim, {
			toValue: 0.5,
			duration: 100
		}).start(() => {
			Animated.timing(this.state.scaleAnim, {
				toValue: 1,
				duration: 100
			}).start();
		});
	};

	_scaleIn = () => {
		Animated.spring(this.state.scaleAnim, {
			toValue: 1
		}).start();
	};

	_scaleOut = () => {
		Animated.spring(this.state.scaleAnim, {
			toValue: 0
		}).start();
	};

	render() {
		const { count } = this.props;

		if (!count) {
			return null;
		}

		return (
			<Animated.View {...this.props} style={[ { transform: [ { scale: this.state.scaleAnim } ] }, styles.badge, this.props.style ]}>
				<AppText style={styles.count}>
					{count < 100 ? count : '99+'}
				</AppText>
			</Animated.View>
		);
	}
}

NotificationBadge.propTypes = {
	count: React.PropTypes.number.isRequired
};
