/* @flow */

import React from "react-native";
import core from "../store/core";
import actions from "../store/actions";

const {
	InteractionManager
} = React;

export default function(Target: React.Component): React.Component {
	class Container extends Target {
		_mounted: boolean;
		_handlers: Array<Array<string|number|Function>>;

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

		runAfterInteractions(cb: Function) {
			InteractionManager.runAfterInteractions(() => {
				if (this._mounted) {
					cb();
				}
			});
		}

		handle(event: string, cb: Function, prio: number = 100, ...rest) {
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
			} else {
				return actions.emit(...args);
			}
		}

		query(...args) {
			if (typeof super.query === "function") {
				return super.query(...args);
			} else {
				return actions.query(...args);
			}
		}

		dispatch(...args) {
			if (typeof super.dispatch === "function") {
				return super.dispatch(...args);
			} else {
				return actions.dispatch(...args);
			}
		}
	}

	Container.displayName = Target.name;

	return Container;
}
