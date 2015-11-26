import core from "../../store/core";
import actions from "../../store/actions";

export default function(Target) {
	class Controller extends Target {
		componentDidMount() {
			if (typeof super.componentDidMount === "function") {
				super.componentDidMount();
			}

			this._mounted = true;
		}

		componentWillUnmount() {
			if (typeof super.componentWillUnmount === "function") {
				super.componentWillUnmount();
			}

			this._mounted = false;

			// Clean up handlers
			if (this._handlers && this._handlers.length) {
				for (let i = 0, l = this._handlers.length; i < l; i++) {
					core.off(...this._handlers[i]);
				}
			}
		}

		handle(event, cb, prio = 100, ...rest) {
			if (typeof super.handle === "function") {
				return super.handle(event, cb, prio, ...rest);
			}

			const handler = cb.bind(this);

			// Attach the event handler
			core.on(event, handler, prio);

			// Keep track so we can clean up later
			this._handlers = this._handlers || [];
			this._handlers.push([ event, handler, prio ]);

			// Return the index
			return this._handlers.length - 1;
		}

		emit(...args) {
			if (typeof super.emit === "function") {
				return super.emit(...args);
			}

			return actions.emit(...args);
		}

		query(...args) {
			if (typeof super.query === "function") {
				return super.query(...args);
			}

			return actions.query(...args);
		}

		dispatch(...args) {
			if (typeof super.dispatch === "function") {
				return super.dispatch(...args);
			}

			return actions.dispatch(...args);
		}
	}

	Controller.displayName = Target.name;

	return Controller;
}
