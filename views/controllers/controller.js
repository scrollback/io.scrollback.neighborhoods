import core from "../../store/core";
import store from "../../store/store";

// Decorator for controllers
export default function(Target) {
	return class extends Target {
		constructor(props) {
			super(props);

			this.core = core;
			this.store = store;

			this._handlers = [];
		}

		componentDidMount(...args) {
			if (typeof super.componentDidMount === "function") {
				super.componentDidMount(...args);
			}

			this._mounted = true;
		}

		componentWillUnmount(...args) {
			if (typeof super.componentWillUnmount === "function") {
				super.componentWillUnmount(...args);
			}

			this._mounted = false;

			// Clean up handlers
			for (let i = 0, l = this._handlers.length; i < l; i++) {
				core.off(...this._handlers[i]);
			}
		}

		handle(event, cb, ...rest) {
			if (typeof super.handle === "function") {
				super.handle(event, cb, ...rest);
			}

			const handler = cb.bind(this);

			// Attach the event handler
			core.on(event, handler, ...rest);

			// Keep track so we can clean up later
			this._handlers.push([ event, handler, ...rest ]);

			// Return the index
			return this._handlers.length - 1;
		}
	};
}
