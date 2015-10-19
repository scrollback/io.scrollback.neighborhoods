import React from "react-native";
import AppbarTouchable from "./appbar-touchable";
import AppbarIcon from "./appbar-icon";
import routes from "../utils/routes";

const {
	StyleSheet,
	Animated,
	Text
} = React;

const styles = StyleSheet.create({
	badge: {
		position: "absolute",
		top: 10,
		right: 10,
		height: 24,
		width: 24,
		borderRadius: 12,
		paddingVertical: 4,
		backgroundColor: "#E91E63"
	},
	count: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 10,
		textAlign: "center"
	}
});

export default class NotificationIcon extends React.Component {
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

	_bounce() {
		Animated.timing(this.state.scaleAnim, {
			toValue: 0.5,
			duration: 100
		}).start(() => {
			Animated.timing(this.state.scaleAnim, {
				toValue: 1,
				duration: 100
			}).start();
		});
	}

	_scaleIn() {
		Animated.spring(this.state.scaleAnim, {
			toValue: 1
		}).start();
	}

	_scaleOut() {
		Animated.spring(this.state.scaleAnim, {
			toValue: 0
		}).start();
	}

	_onPress() {
		this.props.navigator.push(routes.notes());
	}

	render() {
		const { count } = this.props;

		return (
			<AppbarTouchable onPress={this._onPress.bind(this)}>
				<AppbarIcon name="notifications" />
				{count ?
					<Animated.View style={[ { transform: [ { scale: this.state.scaleAnim } ] }, styles.badge ]}>
						<Text style={styles.count}>
							{count < 100 ? count : "99+"}
						</Text>
					</Animated.View> :
					null
				}
			</AppbarTouchable>
		);
	}
}

NotificationIcon.propTypes = {
	count: React.PropTypes.number.isRequired,
	navigator: React.PropTypes.object.isRequired
};
