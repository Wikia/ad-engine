import { Container, Injectable } from '@wikia/dependency-injection';
import { ProcessPipeline } from '../process-pipeline';
import { CompoundProcess, CompoundProcessStep, ProcessStepUnion } from '../process-pipeline-types';

@Injectable()
class OnceProcess<T> implements CompoundProcess<ProcessStepUnion<T>> {
	private created = new Set<ProcessStepUnion<T>>();

	constructor(private container: Container) {}

	execute(payload: ProcessStepUnion<T>): Promise<void> | void {
		if (this.created.has(payload)) {
			return;
		}

		this.created.add(payload);

		const pipeline = this.container.get(ProcessPipeline);

		return pipeline.add(payload).execute();
	}
}

export function once<T>(step: ProcessStepUnion<T>): CompoundProcessStep<ProcessStepUnion<T>> {
	return {
		process: OnceProcess,
		payload: step,
	};
}
