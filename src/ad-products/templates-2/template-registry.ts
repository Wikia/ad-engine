import { Dictionary, Type } from '@ad-engine/core';
import { Container } from '@wikia/dependency-injection';
import { TemplateMachine } from './template-machine';
import { TemplateStateHandler } from './template-state-handler';

export class TemplateRegistry {
	private machines = new Map<string, TemplateMachine>();

	constructor(private container: Container) {}

	register<T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]>>(
		name: string,
		StateHandlerTypesDict: T,
		initialStateKey: keyof T,
	): void {
		const stateHandlersDict = Object.keys(StateHandlerTypesDict)
			.map((stateKey: keyof T) => this.createStateHandlersDict(StateHandlerTypesDict, stateKey))
			.reduce((result, curr) => ({ ...result, ...curr }), {});
		const machine = new TemplateMachine(stateHandlersDict, initialStateKey);

		this.machines.set(name, machine);
	}

	private createStateHandlersDict<T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]>>(
		StateHandlerTypesDict: T,
		stateKey: keyof T,
	): Dictionary<TemplateStateHandler<keyof T>[]> {
		const stateHandlers = this.createStateHandlers(StateHandlerTypesDict, stateKey);

		return { [stateKey]: stateHandlers };
	}

	private createStateHandlers<T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]>>(
		StateHandlerTypesDict: T,
		stateKey: keyof T,
	): TemplateStateHandler<keyof T>[] {
		const StateHandlerTypes = StateHandlerTypesDict[stateKey];

		return StateHandlerTypes.map((StateHandlerType) => this.createStateHandler(StateHandlerType));
	}

	private createStateHandler<T extends string>(
		StateHandlerType: Type<TemplateStateHandler<T>>,
	): TemplateStateHandler<T> {
		this.container.bind(StateHandlerType).scope('Transient');

		return this.container.get(StateHandlerType);
	}
}
