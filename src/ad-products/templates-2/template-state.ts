import { utils } from '@ad-engine/core';
import { TemplateStateHandler } from './template-state-handler';
import { Transition } from './template-state-transition';

export class TemplateState<T extends string> {
	constructor(
		private name: string,
		private transition: Transition<T>,
		private handlers: TemplateStateHandler<T>[],
	) {}

	async enter(): Promise<void> {
		utils.logger(`State - ${this.name}`, 'enter');
		await Promise.all(this.handlers.map(async (handler) => handler.onEnter(this.useTransition())));
		utils.logger(`State - ${this.name}`, 'entered');
	}

	async leave(): Promise<void> {
		utils.logger(`State - ${this.name}`, 'leave');
		await Promise.all(this.handlers.map(async (handler) => handler.onLeave()));
		utils.logger(`State - ${this.name}`, 'left');
	}

	private useTransition(): Transition<T> {
		let called = false;

		return (targetStateKey) => {
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
