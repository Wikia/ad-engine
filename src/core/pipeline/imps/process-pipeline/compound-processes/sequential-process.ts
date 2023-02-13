import { container, injectable } from 'tsyringe';
import { ProcessPipeline } from '../process-pipeline';
import { CompoundProcess, CompoundProcessStep, ProcessStepUnion } from '../process-pipeline-types';

@injectable()
class SequentialProcess<T> implements CompoundProcess<ProcessStepUnion<T>[]> {
	execute(payload: ProcessStepUnion<T>[]): Promise<void> | void {
		const pipeline = container.resolve(ProcessPipeline);

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
