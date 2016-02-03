/* @flow */

import type { Route } from "./Route";
import NotificationIcon from "../views/NotificationIcon";
import AccountButton from "../views/Account/AccountButton";
import ShareButtonContainer from "../containers/ShareButtonContainer";
import DiscussionsDetailsContainer from "../containers/DiscussionDetailsContainer";
import ChatContainer from "../containers/ChatContainer";
import ChatTitleContainer from "../containers/ChatTitleContainer";
import LocalityTitleContainer from "../containers/LocalityTitleContainer";
import DiscussionsContainer from "../containers/DiscussionsContainer";
import NotificationCenterContainer from "../containers/NotificationCenterContainer";
import NotificationClearIconContainer from "../containers/NotificationClearIconContainer";
import LocalitiesContainer from "../containers/LocalitiesContainer";
import AccountContainer from "../containers/AccountContainer";
import SignUpContainer from "../containers/SignUpContainer";
import StartDiscussionContainer from "../containers/StartDiscussionContainer";
import MyPlacesContainer from "../containers/MyPlacesContainer";
import config from "../store/config";

type RouteDescription = {
	title?: string;
	titleComponent?: Function;
	leftComponent?: Function;
	rightComponent?: Function;
	component?: Function;
}

export default function(route: Route): RouteDescription {
	switch (route.name) {
	case "room":
		return {
			titleComponent: LocalityTitleContainer,
			rightComponent: NotificationIcon,
			component: DiscussionsContainer,
		};
	case "chat":
		return {
			titleComponent: ChatTitleContainer,
			rightComponent: NotificationIcon,
			component: ChatContainer,
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
	case "places":
		return {
			title: "My places",
			component: MyPlacesContainer
		};
	case "details":
		return {
			title: "Details",
			component: DiscussionsDetailsContainer,
			rightComponent: ShareButtonContainer
		};
	case "onboard":
		return {
			title: "Sign in",
			component: SignUpContainer,
		};
	case "compose":
		return {
			title: "Start new discussion",
			component: StartDiscussionContainer,
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
