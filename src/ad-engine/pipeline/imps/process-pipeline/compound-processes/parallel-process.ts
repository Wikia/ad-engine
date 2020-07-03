import { Container } from '@wikia/dependency-injection';
import { ProcessPipeline } from '../process-pipeline';
import { CompoundProcess, CompoundProcessStep, ProcessStepUnion } from '../process-pipeline-types';

class ParallelProcess<T> implements CompoundProcess<ProcessStepUnion<T>[]> {
	constructor(private container: Container) {}

	execute(payload: ProcessStepUnion<T>[]): Promise<void> | void {
		return Promise.all(
			payload.map((step) => {
				const pipeline = this.container.get(ProcessPipeline);

				return pipeline.add(step).execute();
			}),
		).then();
	}
}

export function parallel<T>(
	...steps: ProcessStepUnion<T>[]
): CompoundProcessStep<ProcessStepUnion<T>[]> {
	return {
		process: ParallelProcess,
		payload: steps,
	};
}
