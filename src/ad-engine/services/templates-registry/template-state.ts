import { createExtendedPromise, logger } from '../../utils';

import { TemplateStateHandler } from './template-state-handler';
import { TemplateTransition } from './template-state-transition';

export class TemplateState<T extends string> {
	constructor(
		private name: string,
		private transition: TemplateTransition<T>,
		private handlers: TemplateStateHandler<T>[],
	) {}

	async enter(): Promise<void> {
		const transitionCompleted = createExtendedPromise();

		logger(`State - ${this.name}`, 'enter');
		await Promise.all(
			this.handlers.map(async (handler) =>
				handler.onEnter(this.useTransition(transitionCompleted)),
			),
		);
		transitionCompleted.resolve();
		logger(`State - ${this.name}`, 'entered');
	}

	async leave(): Promise<void> {
		logger(`State - ${this.name}`, 'leave');
		await Promise.all(this.handlers.map(async (handler) => handler.onLeave()));
		logger(`State - ${this.name}`, 'left');
	}

	private useTransition(ready: Promise<void>): TemplateTransition<T> {
		let called = false;

		return async (targetStateKey) => {
			await ready;

			if (called) {
				throw new Error(
					'Attempting to call transition second time. ' +
						'You may need to create better "onLeave" method to clean up any listeners.',
				);
			}

			called = true;

			return this.transition(targetStateKey);
		};
	}
}
