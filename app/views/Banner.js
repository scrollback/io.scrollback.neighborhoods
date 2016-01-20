import React from "react-native";
import Colors from "../../Colors.json";
import AppText from "./AppText";
import Icon from "./Icon";
import TouchFeedback from "./TouchFeedback";

const {
	StyleSheet,
	Animated,
	View
} = React;

const styles = StyleSheet.create({
	banner: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.fadedBlack
	},
	info: {
		backgroundColor: Colors.info
	},
	error: {
		backgroundColor: Colors.error
	},
	success: {
		backgroundColor: Colors.success
	},
	textContainer: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 12
	},
	text: {
		color: Colors.white
	},
	icon: {
		margin: 16,
		color: Colors.white
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

	_animateIn = cb => {
		Animated.timing(this.state.heightAnim, {
			toValue: 45,
			duration: 200
		}).start(cb);
	};

	_animateOut = cb => {
		Animated.timing(this.state.heightAnim, {
			toValue: 0,
			duration: 200
		}).start(cb);
	};

	_closeBanner = () => {
		this._animateOut(() => {
			this.setState({
				text: null
			});
		});
	};

	render() {
		if (!this.state.text) {
			return null;
		}

		return (
			<Animated.View {...this.props} style={[ styles.banner, styles[this.props.type], { height: this.state.heightAnim }, this.props.style ]}>
				<View style={styles.textContainer}>
					<AppText style={styles.text} numberOfLines={1}>{this.state.text}</AppText>
				</View>
				{this.props.showClose ?
					<TouchFeedback onPress={this._closeBanner}>
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
