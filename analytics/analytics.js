import signin from "./signin";
import screens from "./screens";

function initialize() {
	signin.start();
	screens.start();
}

export default {
	initialize
};
