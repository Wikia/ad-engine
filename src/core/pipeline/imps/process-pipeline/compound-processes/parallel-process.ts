import { container, injectable } from 'tsyringe';
import { ProcessPipeline } from '../process-pipeline';
import { CompoundProcess, CompoundProcessStep, ProcessStepUnion } from '../process-pipeline-types';

@injectable()
class ParallelProcess<T> implements CompoundProcess<ProcessStepUnion<T>[]> {
	execute(payload: ProcessStepUnion<T>[]): Promise<void> | void {
		return Promise.all(
			payload.map((step) => {
				const pipeline = container.resolve(ProcessPipeline);

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
