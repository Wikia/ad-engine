import { Container, Injectable } from '@wikia/dependency-injection';
import { Pipeline } from '../../pipeline';
import { PipelineAdapter, PipelineNext } from '../../pipeline-types';
import { isCompoundProcessStep, isDiProcess, ProcessStepUnion } from './process-pipeline-types';

@Injectable({ scope: 'Transient' })
class ProcessPipelineAdapter implements PipelineAdapter<ProcessStepUnion, void> {
	constructor(private container: Container) {}

	async execute(step: ProcessStepUnion, payload: void, next?: PipelineNext<void>): Promise<void> {
		if (isCompoundProcessStep(step)) {
			const process = this.container.get(step.process);

			return process.execute(step.payload);
		}

		if (isDiProcess(step)) {
			const instance = this.container.get(step);

			return instance.execute();
		}

		return step();
	}
}

@Injectable({ scope: 'Transient' })
export class ProcessPipeline extends Pipeline<ProcessStepUnion> {
	constructor(container: Container) {
		super(container.get(ProcessPipelineAdapter));
	}
}
