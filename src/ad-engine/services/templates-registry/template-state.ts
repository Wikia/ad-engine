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
		const transition = this.useTransition(transitionCompleted);

		logger(`State - ${this.name}`, 'enter');
		await Promise.all(this.handlers.map(async (handler) => handler.onEnter(transition)));
		logger(`State - ${this.name}`, 'entered');
		transitionCompleted.resolve();
	}

	async leave(): Promise<void> {
		logger(`State - ${this.name}`, 'leave');
		await Promise.all(this.handlers.map(async (handler) => handler.onLeave()));
		logger(`State - ${this.name}`, 'left');
	}

	private useTransition(completed: Promise<void>): TemplateTransition<T> {
		let called = false;

		return async (targetStateKey) => {
			await completed;

			if (called) {
				throw new Error(
					// tslint:disable-next-line:prefer-template
					`Error thrown while attempting to transition to "${targetStateKey}" state. ` +
						`Attempting to call transition from "${this.name}" state a second time.\n` +
						'This may be caused by:\n' +
						'- not cleaning listeners in an "onLeave" method,\n' +
						'- calling transition in a different handler at the same time.\n' +
						'You may suppress this error by placing transition method inside a try catch block.\n',
				);
			}

			called = true;

			return this.transition(targetStateKey);
		};
	}
}
