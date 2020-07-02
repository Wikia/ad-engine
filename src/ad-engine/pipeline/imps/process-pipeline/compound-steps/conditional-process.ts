import { Container, Injectable } from '@wikia/dependency-injection';
import { Type } from '../../../../models/dictionary';
import { ProcessPipeline } from '../process-pipeline';
import { CompoundProcess, CompoundProcessStep, ProcessStepUnion } from '../process-pipeline-types';

type Condition = Type<DiCondition> | FuncCondition;

interface DiCondition {
	execute(): Promise<boolean> | boolean;
}

type FuncCondition = () => Promise<boolean> | boolean;

interface ConditionalProcessPayload<T> {
	condition: Condition;
	yesSteps: ProcessStepUnion<T>[];
	noSteps: ProcessStepUnion<T>[];
}

@Injectable({ scope: 'Transient' })
class ConditionalProcess<T> implements CompoundProcess<ConditionalProcessPayload<T>> {
	constructor(private container: Container) {}

	async execute(payload: ConditionalProcessPayload<T>): Promise<void> {
		const result = await this.getResult(payload.condition);
		const pipeline = this.container.get(ProcessPipeline);
		const steps = result ? payload.yesSteps : payload.noSteps;

		return pipeline.add(...steps).execute();
	}

	private getResult(condition: Condition): Promise<boolean> | boolean {
		if (this.isDiCondition(condition)) {
			return this.container.get(condition).execute();
		}

		return condition();
	}

	private isDiCondition(step: Condition): step is Type<DiCondition> {
		return typeof step.prototype.execute === 'function';
	}
}

export function conditional<T>(
	condition: ConditionalProcessPayload<T>['condition'],
	steps: {
		yes: ConditionalProcessPayload<T>['yesSteps'];
		no: ConditionalProcessPayload<T>['noSteps'];
	},
): CompoundProcessStep<ConditionalProcessPayload<T>> {
	return {
		process: ConditionalProcess,
		payload: { condition, yesSteps: steps.yes, noSteps: steps.no },
	};
}
