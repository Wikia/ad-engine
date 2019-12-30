import { Dictionary, Type } from '@ad-engine/core';
import { Container, Injectable } from '@wikia/dependency-injection';
import { TemplateMachine } from './template-machine';
import { TemplateParamsRegistry } from './template-params-registry';
import { TemplateStateHandler } from './template-state-handler';

interface TemplateMachinePayload<
	T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]> = any
> {
	StateHandlerTypesDict: T;
	initialStateKey: keyof T;
}

@Injectable()
export class TemplateRegistry {
	private settings = new Map<string, TemplateMachinePayload>();
	private machines = new Map<string, TemplateMachine>();

	constructor(private container: Container, private paramsRegistry: TemplateParamsRegistry) {}

	register<T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]>>(
		templateName: string,
		StateHandlerTypesDict: T,
		initialStateKey: keyof T,
	): void {
		this.settings.set(templateName, { StateHandlerTypesDict, initialStateKey });
	}

	init(templateName: string, templateParams: Dictionary): void {
		if (!this.settings.has(templateName)) {
			throw new Error(`Template ${templateName} was not registered`);
		}
		if (this.machines.has(templateName)) {
			throw new Error(`Template ${templateName} is already initialized`);
		}

		this.paramsRegistry.register(templateName, templateParams);

		const { StateHandlerTypesDict, initialStateKey } = this.settings.get(templateName);
		const machine = this.createMachine(templateName, StateHandlerTypesDict, initialStateKey);

		this.machines.set(templateName, machine);
	}

	private createMachine<T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]>>(
		templateName: string,
		StateHandlerTypesDict: T,
		initialStateKey: keyof T,
	): TemplateMachine<Dictionary<TemplateStateHandler<keyof T>[]>> {
		const stateHandlersDict = Object.keys(StateHandlerTypesDict)
			.map((stateKey: keyof T) => this.createStateHandlersDict(StateHandlerTypesDict, stateKey))
			.reduce((result, curr) => ({ ...result, ...curr }), {});

		return new TemplateMachine(templateName, stateHandlersDict, initialStateKey);
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
