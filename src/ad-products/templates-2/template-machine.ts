import { Dictionary, utils } from '@ad-engine/core';
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
	private states: Map<keyof T, TemplateState<keyof T>> = new Map();
	private currentStateKey: keyof T;

	constructor(private templateName: string, stateHandlersDict: T, initialStateKey: keyof T) {
		this.currentStateKey = initialStateKey;
		this.states = new Map(
			Object.keys(stateHandlersDict).map((stateKey: keyof T) => [
				stateKey,
				new TemplateState(stateKey, this.transition, stateHandlersDict[stateKey]),
			]),
		);

		this.init();
	}

	private init(): void {
		utils.logger(`Template ${this.templateName}`, 'initialize');
		this.currentState.enter();
	}

	private transition: TemplateTransition<keyof T> = async (targetStateKey) => {
		if (this.currentStateKey === targetStateKey) {
			throw new Error(
				`Template ${this.templateName} - already is in ${this.currentStateKey} state`,
			);
		}

		await this.currentState.leave();
		this.currentStateKey = targetStateKey;
		await this.currentState.enter();
	};
}
