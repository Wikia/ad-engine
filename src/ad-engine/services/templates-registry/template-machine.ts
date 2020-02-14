import { Dictionary } from '../../models';
import { logger } from '../../utils';
import { TemplateState } from './template-state';
import { TemplateStateHandler } from './template-state-handler';
import { TemplateTransition } from './template-state-transition';

export class TemplateMachine<T extends Dictionary<TemplateStateHandler<keyof T>[]> = any> {
	private get currentState(): TemplateState<keyof T> {
		if (!this.states.has(this.currentStateKey)) {
			throw new Error(
				`Template ${this.templateName} - state (${this.currentStateKey}) does not exist.`,
			);
		}

		return this.states.get(this.currentStateKey);
	}

	constructor(
		private templateName: string,
		private states: Map<keyof T, TemplateState<keyof T>>,
		private currentStateKey: keyof T,
	) {}

	init(): void {
		logger(`Template ${this.templateName}`, 'initialize');
		this.currentState.enter(this.transition);
	}

	private transition: TemplateTransition<keyof T> = async (targetStateKey) => {
		if (this.currentStateKey === targetStateKey) {
			throw new Error(
				`Template ${this.templateName} - already is in ${this.currentStateKey} state`,
			);
		}

		await this.currentState.leave();
		this.currentStateKey = targetStateKey;
		await this.currentState.enter(this.transition);
	};
}
