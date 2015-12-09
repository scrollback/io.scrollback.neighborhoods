import React from "react-native";
import AppText from "./app-text";
import timeUtils from "../lib/time-utils";

const msPerSec = 1000;
const msPerMin = msPerSec * 60;
const msPerHour = msPerMin * 60;

export default class Time extends React.Component {
	componentWillMount() {
		const now = Date.now();

		this.setState({
			now
		});

		this._setTimer(now);
	}

	componentWillUnmount() {
		if (this._timer) {
			clearTimeout(this._timer);
		}
	}

	setNativeProps(nativeProps) {
		this._root.setNativeProps(nativeProps);
	}

	_setTimer(time) {
		const diff = time - this.props.time;

		let interval;

		if (diff < msPerMin) {
			interval = msPerSec * 10;
		} else if (diff < msPerHour) {
			interval = msPerMin;
		}

		if (interval) {
			this._timer = setTimeout(() => {
				const now = Date.now();

				this.setState({
					now
				});

				this._setTimer(now);
			}, interval);
		}
	}

	render() {
		const {
			type,
			time
		} = this.props;

		return (
			<AppText ref={c => this._root = c} {...this.props}>
				{type === "short" ? timeUtils.short(time, this.state.now) : timeUtils.long(time, this.state.now)}
			</AppText>
		);
	}
}

Time.propTypes = {
	type: React.PropTypes.oneOf([ "short", "long" ]).isRequired,
	time: React.PropTypes.number.isRequired
};
