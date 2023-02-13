import { container, singleton } from 'tsyringe';
import { ProcessPipeline } from '../process-pipeline';
import { CompoundProcess, CompoundProcessStep, ProcessStepUnion } from '../process-pipeline-types';

@singleton()
class OnceProcess<T> implements CompoundProcess<ProcessStepUnion<T>> {
	private created = new Set<ProcessStepUnion<T>>();

	execute(payload: ProcessStepUnion<T>): Promise<void> | void {
		if (this.created.has(payload)) {
			return;
		}

		this.created.add(payload);

		const pipeline = container.resolve(ProcessPipeline);

		return pipeline.add(payload).execute();
	}
}

export function once<T>(step: ProcessStepUnion<T>): CompoundProcessStep<ProcessStepUnion<T>> {
	return {
		process: OnceProcess,
		payload: step,
	};
}
