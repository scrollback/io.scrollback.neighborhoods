import React from "react-native";
import Banner from "./banner";

export default class BannerOffline extends React.Component {
	shouldComponentUpdate(nextProps) {
		return this.props.connectionStatus !== nextProps.connectionStatus;
	}

	render() {
		const { connectionStatus } = this.props;

		let label;

		switch (connectionStatus) {
		case "offline":
			label = "Network unavailable. Waiting for connection…";
			break;
		case "connecting":
			label = "Connecting to server…";
			break;
		default:
			label = "";
		}

		return (
			<Banner
				{...this.props}
				text={label}
				showClose={false}
			/>
		);
	}
}

BannerOffline.propTypes = {
	connectionStatus: React.PropTypes.oneOf([ "offline", "connecting", "online" ])
};
