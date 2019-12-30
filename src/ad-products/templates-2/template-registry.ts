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
			.map((stateKey: keyof T) => {
				const StateHandlerTypes = StateHandlerTypesDict[stateKey];
				const stateHandlers = StateHandlerTypes.map((StateHandlerType) =>
					this.createStateHandler(StateHandlerType),
				);

				return { [stateKey]: stateHandlers };
			})
			.reduce((result, curr) => ({ ...result, ...curr }), {});
		const machine = new TemplateMachine(stateHandlersDict, initialStateKey);

		this.machines.set(name, machine);
	}

	private createStateHandler(StateHandlerType: Type<TemplateStateHandler>): TemplateStateHandler {
		this.container.bind(StateHandlerType).scope('Transient');

		return this.container.get(StateHandlerType);
	}
}
