import { Container, Injectable } from '@wikia/dependency-injection';
import { UniversalPipeline, UniversalPipelineStep } from '../../universal-pipeline';
import { ProcessPipeline } from '../process-pipeline';
import { CompoundProcess, CompoundProcessStep, ProcessStepUnion } from '../process-pipeline-types';

interface ConditionalProcessPayload<T> {
	condition: UniversalPipelineStep<boolean>; // TODO: replace it with something simpler?
	yesSteps: ProcessStepUnion<T>[];
	noSteps: ProcessStepUnion<T>[];
}

@Injectable({ scope: 'Transient' })
class ConditionalProcess<T> implements CompoundProcess<ConditionalProcessPayload<T>> {
	constructor(private container: Container) {}

	async execute(payload: ConditionalProcessPayload<T>): Promise<void> {
		const result = await this.container
			.get(UniversalPipeline)
			.add(payload.condition)
			.execute(false);

		const pipeline = this.container.get(ProcessPipeline);
		const steps = result ? payload.yesSteps : payload.noSteps;

		return pipeline.add(...steps).execute();
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
