import { Container, Injectable } from '@wikia/dependency-injection';
import { ProcessPipeline } from '../process-pipeline';
import { CompoundProcess, CompoundProcessStep, ProcessStepUnion } from '../process-pipeline-types';

@Injectable({ scope: 'Transient' })
class SequentialProcess<T> implements CompoundProcess<ProcessStepUnion<T>[]> {
	constructor(private container: Container) {}

	execute(payload: ProcessStepUnion<T>[]): Promise<void> | void {
		const pipeline = this.container.get(ProcessPipeline);

		return pipeline.add(...payload).execute();
	}
}

export function sequential<T>(
	...steps: ProcessStepUnion<T>[]
): CompoundProcessStep<ProcessStepUnion<T>[]> {
	return {
		process: SequentialProcess,
		payload: steps,
	};
}
