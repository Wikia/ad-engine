import { Container, Injectable } from '@wikia/dependency-injection';
import { AdSlot, Dictionary, Type } from '../../models';
import { TemplateDependenciesManager } from './template-dependencies-manager';
import { TemplateMachine } from './template-machine';
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

	constructor(
		private container: Container,
		private dependenciesManager: TemplateDependenciesManager,
	) {}

	register<T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]>>(
		templateName: string,
		StateHandlerTypesDict: T,
		initialStateKey: keyof T,
	): void {
		this.settings.set(templateName, { StateHandlerTypesDict, initialStateKey });
	}

	init(templateName: string, templateSlot: AdSlot, templateParams: Dictionary = {}): void {
		if (!this.settings.has(templateName)) {
			throw new Error(`Template ${templateName} was not registered`);
		}
		if (this.machines.has(templateName)) {
			throw new Error(`Template ${templateName} is already initialized`);
		}

		this.dependenciesManager.provideDependencies(templateName, templateSlot, templateParams);

		const { StateHandlerTypesDict, initialStateKey } = this.settings.get(templateName);
		const stateHandlersDict = this.createStateHandlersDict(StateHandlerTypesDict);

		this.dependenciesManager.resetDependencies();

		const machine = new TemplateMachine(templateName, stateHandlersDict, initialStateKey);

		this.machines.set(templateName, machine);
	}

	private createStateHandlersDict<T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]>>(
		StateHandlerTypesDict: T,
	): Dictionary<TemplateStateHandler<keyof T>[]> {
		return Object.keys(StateHandlerTypesDict)
			.map((stateKey: keyof T) => ({
				[stateKey]: this.createStateHandlers(StateHandlerTypesDict, stateKey),
			}))
			.reduce((result, curr) => ({ ...result, ...curr }), {});
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
