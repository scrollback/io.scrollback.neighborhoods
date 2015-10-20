import NotificationIconController from "../controllers/notification-icon-controller";
import ChatController from "../controllers/chat-controller";
import ChatTitleController from "../controllers/chat-title-controller";
import RoomTitleController from "../controllers/room-title-controller";
import DiscussionsController from "../controllers/discussions-controller";
import NotificationCenterController from "../controllers/notification-center-controller";
import NotificationClearIconController from "../controllers/notification-clear-icon-controller";
import PeopleListController from "../controllers/people-list-controller";
import UserIconController from "../controllers/user-icon-controller";
import LocalitiesController from "../controllers/localities-controller";
import AccountController from "../controllers/account-controller";
import SignInController from "../controllers/sign-in-controller";
import StartDiscussionController from "../controllers/start-discussion-controller";

const routes = {};

routes.home = () => {
	return {
		title: "Hey, Neighbor!",
		leftComponent: UserIconController,
		rightComponent: NotificationIconController,
		component: LocalitiesController,
		index: 0
	};
};

routes.chat = props => {
	return {
		titleComponent: ChatTitleController,
		rightComponent: NotificationIconController,
		component: ChatController,
		passProps: props
	};
};

routes.people = props => {
	return {
		title: "People talking",
		component: PeopleListController,
		passProps: props
	};
};

routes.room = props => {
	return {
		titleComponent: RoomTitleController,
		rightComponent: NotificationIconController,
		component: DiscussionsController,
		passProps: props
	};
};

routes.notes = () => {
	return {
		title: "Notifications",
		component: NotificationCenterController,
		rightComponent: NotificationClearIconController
	};
};

routes.account = () => {
	return {
		title: "My account",
		component: AccountController
	};
};

routes.signin = props => {
	return {
		title: "Sign in",
		component: SignInController,
		passProps: props
	};
};

routes.startthread = props => {
	return {
		title: "Start new discussion",
		component: StartDiscussionController,
		passProps: props
	};
};

routes.fromURL = url => {
	const parts = url
					.replace(/^([a-z]+\:)?\/\/[^\/]+/, "") // strip host and protocol
					.replace(/\?[^\?]+/, "") // strip query params for now, as we don't use it right now
					.replace(/^\/|\/$/g, "") // strip leading and trailing slash
					.split("/");

	switch (parts.length) {
	case 1:
		return routes.room({ room: parts[0] });
	case 2:
		return routes.chat({
			room: parts[0],
			thread: parts[1]
		});
	default:
		return routes.home();
	}
};

export default routes;
