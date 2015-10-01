import NotificationIconController from "./notification-icon-controller";
import ChatController from "./chat-controller";
import ChatTitleController from "./chat-title-controller";
import DiscussionsController from "./discussions-controller";
import NotificationCenterController from "./notification-center-controller.js";
import UserIcon from "./user-icon";
import Home from "./home";

const routes = {};

routes.home = () => {
    return {
        title: "Hey, Neighbor!",
        leftComponent: UserIcon,
        rightComponent: NotificationIconController,
        component: Home,
        index: 0
    };
};

routes.chat = (props) => {
    return {
        titleComponent: ChatTitleController,
        rightComponent: NotificationIconController,
        component: ChatController,
        passProps: props
    };
};

routes.room = (props) => {
    return {
        title: props.room.displayName,
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
