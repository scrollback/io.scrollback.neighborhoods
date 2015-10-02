import NotificationIconController from "../controllers/notification-icon-controller";
import ChatController from "../controllers/chat-controller";
import ChatTitleController from "../controllers/chat-title-controller";
import RoomTitleController from "../controllers/room-title-controller";
import DiscussionsController from "../controllers/discussions-controller";
import NotificationCenterController from "../controllers/notification-center-controller.js";
import PeopleListController from "../controllers/people-list-controller";
import UserIconController from "../controllers/user-icon-controller";
import LocalitiesController from "../controllers/localities-controller";
import SignIn from "../components/sign-in";

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
        component: NotificationCenterController
    };
};

routes.signin = props => {
    return {
        title: "Sign in",
        component: SignIn,
        passProps: props
    };
};

export default routes;
