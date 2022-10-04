import { Container, Injectable } from '@wikia/dependency-injection';
import { Type } from '../../../models/dictionary';
import { Pipeline } from '../../pipeline';
import { PipelineAdapter, PipelineNext } from '../../pipeline-types';
import {
	CompoundProcessStep,
	DiProcess,
	ProcessStep,
	ProcessStepUnion,
} from './process-pipeline-types';

@Injectable({ scope: 'Transient' })
class ProcessPipelineAdapter implements PipelineAdapter<ProcessStepUnion, void> {
	constructor(private container: Container) {}

	async execute(step: ProcessStepUnion, payload: void, next?: PipelineNext<void>): Promise<void> {
		if (this.isCompoundProcessStep(step)) {
			const process = this.container.get(step.process);

			await process.execute(step.payload);

			return next();
		}

		if (this.isDiProcess(step)) {
			const instance = this.container.get(step);

			await instance.execute();

			return next();
		}

		await step();

		return next();
	}

	private isCompoundProcessStep<T>(step: ProcessStepUnion<T>): step is CompoundProcessStep<T> {
		return (
			typeof step === 'object' &&
			'process' in step &&
			typeof step.process.prototype.execute === 'function'
		);
	}

	private isDiProcess(step: ProcessStep): step is Type<DiProcess> {
		return typeof step.prototype.execute === 'function';
	}
}

@Injectable({ scope: 'Transient' })
export class ProcessPipeline extends Pipeline<ProcessStepUnion> {
	constructor(container: Container) {
		super(container.get(ProcessPipelineAdapter));
	}
}
