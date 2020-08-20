import { Container, Injectable } from '@wikia/dependency-injection';
import { flattenDeep } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { AdSlot, Dictionary, Type } from '../../models';
import { TemplateAction } from './template-action';
import { TemplateDependenciesManager, TemplateDependency } from './template-dependencies-manager';
import { TemplateMachine } from './template-machine';
import { TemplateState } from './template-state';
import { TemplateStateHandler } from './template-state-handler';

interface TemplateMachinePayload<
	T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]> = any
> {
	StateHandlerTypesDict: T;
	initialStateKey: keyof T;
	templateDependencies: TemplateDependency[];
	emitter$: Subject<TemplateAction>;
}

type TemplateDependencies = (TemplateDependency | TemplateDependencies)[];

@Injectable()
export class TemplateRegistry {
	private settings = new Map<string, TemplateMachinePayload>();
	private machines = new Map<string, Set<TemplateMachine>>();

	constructor(
		private container: Container,
		private dependenciesManager: TemplateDependenciesManager,
	) {}

	has(templateName: string): boolean {
		return this.settings.has(templateName);
	}

	register<T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]>>(
		templateName: string,
		StateHandlerTypesDict: T,
		initialStateKey: keyof T,
		templateDependencies: TemplateDependencies = [],
	): Observable<TemplateAction> {
		const emitter$ = new Subject<TemplateAction>();

		this.settings.set(templateName, {
			StateHandlerTypesDict,
			initialStateKey,
			emitter$,
			templateDependencies: flattenDeep<TemplateDependency>(templateDependencies),
		});

		return emitter$.asObservable();
	}

	async destroy(slotName: string): Promise<void> {
		const machines: TemplateMachine[] = Array.from(this.machines.get(slotName) || []);

		await Promise.all(machines.map((machine) => machine.destroy()));

		this.machines.delete(slotName);
	}

	async destroyAll(): Promise<void> {
		await Promise.all(
			Array.from(this.machines.values()).map((set) =>
				Promise.all(Array.from(set.values()).map((machine) => machine.destroy())),
			),
		);

		this.machines.clear();
	}

	init(templateName: string, templateSlot: AdSlot | null, templateParams: Dictionary = {}): void {
		if (!this.settings.has(templateName)) {
			throw new Error(`Template ${templateName} was not registered`);
		}

		const {
			StateHandlerTypesDict,
			initialStateKey,
			emitter$,
			templateDependencies,
		} = this.settings.get(templateName);

		this.dependenciesManager.provideDependencies(
			templateName,
			templateSlot,
			templateParams,
			templateDependencies,
		);

		const templateStateMap = this.createTemplateStateMap(StateHandlerTypesDict);

		this.dependenciesManager.resetDependencies(templateDependencies);

		const machine = new TemplateMachine(templateName, templateStateMap, initialStateKey, emitter$);

		machine.init();
		this.saveMachine(templateSlot, machine);
	}

	private saveMachine(templateSlot: AdSlot | null, machine: TemplateMachine): void {
		const machinesSet =
			this.machines.get(templateSlot?.getSlotName() ?? '__default__') || new Set<TemplateMachine>();

		machinesSet.add(machine);
		this.machines.set(templateSlot?.getSlotName() ?? '__default__', machinesSet);
	}

	private createTemplateStateMap<T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]>>(
		StateHandlerTypesDict: T,
	): Map<keyof T, TemplateState<keyof T>> {
		const keyStateTuples: [keyof T, TemplateState<keyof T>][] = Object.keys(
			StateHandlerTypesDict,
		).map((stateKey: keyof T) => [
			stateKey,
			this.createTemplateState(StateHandlerTypesDict, stateKey),
		]);

		return new Map(keyStateTuples);
	}

	private createTemplateState<T extends Dictionary<Type<TemplateStateHandler<keyof T>>[]>>(
		StateHandlerTypesDict: T,
		stateKey: keyof T,
	): TemplateState<keyof T> {
		const StateHandlerTypes = StateHandlerTypesDict[stateKey];
		const stateHandlers = StateHandlerTypes.map((StateHandlerType) =>
			this.createStateHandler(StateHandlerType),
		);

		return new TemplateState(stateKey, stateHandlers);
	}

	private createStateHandler<T extends string>(
		StateHandlerType: Type<TemplateStateHandler<T>>,
	): TemplateStateHandler<T> {
		this.container.bind(StateHandlerType).scope('Transient');

		return this.container.get(StateHandlerType);
	}
}
