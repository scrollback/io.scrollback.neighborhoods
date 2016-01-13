/* @flow */

import type { Route } from "./Route";
import NotificationIcon from "../views/NotificationIcon";
import AccountButton from "../views/AccountButton";
import DiscussionsDetailsContainer from "../containers/DiscussionDetailsContainer";
import ChatContainer from "../containers/ChatContainer";
import ChatTitleContainer from "../containers/ChatTitleContainer";
import LocalityTitleContainer from "../containers/LocalityTitleContainer";
import DiscussionsContainer from "../containers/DiscussionsContainer";
import NotificationCenterContainer from "../containers/NotificationCenterContainer";
import NotificationClearIconContainer from "../containers/NotificationClearIconContainer";
import LocalitiesContainer from "../containers/LocalitiesContainer";
import AccountContainer from "../containers/AccountContainer";
import SignInContainer from "../containers/SignInContainer";
import StartDiscussionContainer from "../containers/StartDiscussionContainer";
import config from "../store/config";

type RouteDescription = {
	title?: string;
	titleComponent?: Function;
	leftComponent?: Function;
	rightComponent?: Function;
	component?: Function;
	passProps?: Object
}

export default function(route: Route): RouteDescription {
	switch (route.type) {
	case "room":
		return {
			titleComponent: LocalityTitleContainer,
			rightComponent: NotificationIcon,
			component: DiscussionsContainer,
			passProps: route.props
		};
	case "chat":
		return {
			titleComponent: ChatTitleContainer,
			rightComponent: NotificationIcon,
			component: ChatContainer,
			passProps: route.props
		};
	case "notes":
		return {
			title: "Notifications",
			component: NotificationCenterContainer,
			rightComponent: NotificationClearIconContainer
		};
	case "account":
		return {
			title: "My account",
			component: AccountContainer
		};
	case "details":
		return {
			title: "Details",
			component: DiscussionsDetailsContainer,
			passProps: route.props
		};
	case "signin":
		return {
			title: "Sign in",
			component: SignInContainer,
			passProps: route.props
		};
	case "create":
		return {
			title: "Start new discussion",
			component: StartDiscussionContainer,
			passProps: route.props
		};
	default:
		return {
			title: config.app_name,
			leftComponent: AccountButton,
			rightComponent: NotificationIcon,
			component: LocalitiesContainer
		};
	}
}
