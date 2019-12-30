import { Dictionary, Type } from '@ad-engine/core';
import { Container, Injectable } from '@wikia/dependency-injection';
import { TemplateMachine } from './template-machine';
import { TemplateParamsRegistry } from './template-params-registry';
import { TemplateStateHandler } from './template-state-handler';

@Injectable()
export class TemplateRegistry {
	private machines = new Map<string, TemplateMachine>();

	constructor(private container: Container, private paramsRegistry: TemplateParamsRegistry) {}

	init(templateName: string, templateParams: Dictionary): void {
		if (!this.machines.has(templateName)) {
			throw new Error(`Template ${templateName} does not exist.`);
		}

		const machine = this.machines.get(templateName);

		this.paramsRegistry.register(templateName, templateParams);
		machine.init();
	}

	register<T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]>>(
		templateName: string,
		StateHandlerTypesDict: T,
		initialStateKey: keyof T,
	): void {
		const stateHandlersDict = Object.keys(StateHandlerTypesDict)
			.map((stateKey: keyof T) => this.createStateHandlersDict(StateHandlerTypesDict, stateKey))
			.reduce((result, curr) => ({ ...result, ...curr }), {});
		const machine = new TemplateMachine(templateName, stateHandlersDict, initialStateKey);

		this.machines.set(templateName, machine);
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
