import NotificationIcon from "../views/NotificationIcon";
import AccountButton from "../views/AccountButton";
import ChatContainer from "../containers/ChatContainer";
import ChatTitleContainer from "../containers/ChatTitleContainer";
import LocalityTitleContainer from "../containers/LocalityTitleContainer";
import DiscussionsContainer from "../containers/DiscussionsContainer";
import NotificationCenterContainer from "../containers/NotificationCenterContainer";
import NotificationClearIconContainer from "../containers/NotificationClearIconContainer";
import PeopleListContainer from "../containers/PeopleListContainer";
import LocalitiesContainer from "../containers/LocalitiesContainer";
import AccountContainer from "../containers/AccountContainer";
import SignInContainer from "../containers/SignInContainer";
import StartDiscussionContainer from "../containers/StartDiscussionContainer";
import config from "../store/config";

const routes = {};

routes.home = () => {
	return {
		title: config.app_name,
		leftComponent: AccountButton,
		rightComponent: NotificationIcon,
		component: LocalitiesContainer,
		index: 0
	};
};

routes.chat = props => {
	return {
		titleComponent: ChatTitleContainer,
		rightComponent: NotificationIcon,
		component: ChatContainer,
		passProps: props
	};
};

routes.people = props => {
	return {
		title: "People talking",
		component: PeopleListContainer,
		passProps: props
	};
};

routes.room = props => {
	return {
		titleComponent: LocalityTitleContainer,
		rightComponent: NotificationIcon,
		component: DiscussionsContainer,
		passProps: props
	};
};

routes.notes = () => {
	return {
		title: "Notifications",
		component: NotificationCenterContainer,
		rightComponent: NotificationClearIconContainer
	};
};

routes.account = () => {
	return {
		title: "My account",
		component: AccountContainer
	};
};

routes.signin = props => {
	return {
		title: "Sign in",
		component: SignInContainer,
		passProps: props
	};
};

routes.startthread = props => {
	return {
		title: "Start new discussion",
		component: StartDiscussionContainer,
		passProps: props
	};
};

routes.fromURL = url => {
	const parts = url
					.replace(/^([a-z]+\:)?\/\/[^\/]+/, "") // strip host and protocol
					.replace(/\?[^\?]+/, "") // strip query params for now, as we don't use it right now
					.replace(/^\/|\/$/g, "") // strip leading and trailing slash
					.split("/");

	const room = parts[0];
	const thread = parts[1];

	switch (parts.length) {
	case 0:
		return routes.home();
	case 1:
		if (room === "me") {
			return routes.home();
		}

		return routes.room({
			room
		});
	default:
		if (thread === "all") {
			return routes.room({
				room
			});
		}

		return routes.chat({
			room,
			thread
		});
	}
};

export default routes;
