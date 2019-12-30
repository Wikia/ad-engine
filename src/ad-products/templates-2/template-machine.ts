import { Dictionary } from '@ad-engine/core';
import { TemplateState } from './template-state';
import { TemplateStateHandler } from './template-state-handler';
import { Transition } from './template-state-transition';

export class TemplateMachine<T extends Dictionary<TemplateStateHandler<keyof T>[]> = any> {
	private get currentState(): TemplateState<keyof T> {
		if (!this.states.has(this.currentStateKey)) {
			throw new Error(`State (${this.currentStateKey}) does not exist.`);
		}

		return this.states.get(this.currentStateKey);
	}
	private states: Map<keyof T, TemplateState<keyof T>> = new Map();
	private currentStateKey: keyof T;
	private initialized = false;

	constructor(private templateName: string, stateHandlersDict: T, initialStateKey: keyof T) {
		this.currentStateKey = initialStateKey;
		this.states = new Map(
			Object.keys(stateHandlersDict).map((stateKey: keyof T) => [
				stateKey,
				new TemplateState(stateKey, this.transition, stateHandlersDict[stateKey]),
			]),
		);
	}

	init(): void {
		if (this.initialized) {
			throw new Error(`Template ${this.templateName} already initialized`);
		}

		this.currentState.enter();
	}

	private transition: Transition<keyof T> = async (targetStateKey) => {
		await this.currentState.leave();
		this.currentStateKey = targetStateKey;
		await this.currentState.enter();
	};
}

const a = new TemplateMachine('aaa', { first: [], second: [] }, 'first');
