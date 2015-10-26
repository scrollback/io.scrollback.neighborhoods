import React from "react-native";
import Icon from "./icon";
import TouchFeedback from "./touch-feedback";

const {
	StyleSheet,
	Animated,
	View,
	Text
} = React;

const styles = StyleSheet.create({
	banner: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, .5)"
	},
	info: {
		backgroundColor: "#2196F3"
	},
	error: {
		backgroundColor: "#F44336"
	},
	success: {
		backgroundColor: "#4CAF50"
	},
	textContainer: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 12
	},
	text: {
		fontSize: 14,
		lineHeight: 21,
		color: "#fff"
	},
	icon: {
		margin: 16,
		color: "#fff"
	}
});

export default class Banner extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			heightAnim: new Animated.Value(0),
			text: this.props.text
		};
	}

	componentDidMount() {
		if (this.state.text) {
			this._animateIn();
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.text) {
			if (!this.state.text) {
				this.setState({
					text: nextProps.text
				}, () => this._animateIn());

				return;
			}
		} else {
			if (this.state.text) {
				this._closeBanner();

				return;
			}
		}

		this.setState({
			text: nextProps.text
		});
	}

	_animateIn(cb) {
		Animated.timing(this.state.heightAnim, {
			toValue: 45,
			duration: 200
		}).start(cb);
	}

	_animateOut(cb) {
		Animated.timing(this.state.heightAnim, {
			toValue: 0,
			duration: 200
		}).start(cb);
	}

	_closeBanner() {
		this._animateOut(() => {
			this.setState({
				text: null
			});
		});
	}

	render() {
		if (!this.state.text) {
			return null;
		}

		return (
			<Animated.View {...this.props} style={[ styles.banner, styles[this.props.type], { height: this.state.heightAnim }, this.props.style ]}>
				<View style={styles.textContainer}>
					<Text style={styles.text} numberOfLines={1}>{this.state.text}</Text>
				</View>
				{this.props.showClose ?
					<TouchFeedback onPress={this._closeBanner.bind(this)}>
						<View>
							<Icon
								name="close"
								style={styles.icon}
								size={16}
							/>
						</View>
					</TouchFeedback> :
					null
				}
			</Animated.View>
		);
	}
}

Banner.propTypes = {
	text: React.PropTypes.string,
	type: React.PropTypes.oneOf([ "info", "success", "error" ]),
	showClose: React.PropTypes.bool
};

Banner.defaultProps = {
	showClose: true
};
