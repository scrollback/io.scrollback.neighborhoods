import NotificationIconController from "./notification-icon-controller";
import ChatController from "./chat-controller";
import ChatTitleController from "./chat-title-controller";
import RoomTitleController from "./room-title-controller";
import DiscussionsController from "./discussions-controller";
import NotificationCenterController from "./notification-center-controller.js";
import UserIconController from "./user-icon-controller";
import Home from "./home";

const routes = {};

routes.home = () => {
    return {
        title: "Hey, Neighbor!",
        leftComponent: UserIconController,
        rightComponent: NotificationIconController,
        component: Home,
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

export default routes;
