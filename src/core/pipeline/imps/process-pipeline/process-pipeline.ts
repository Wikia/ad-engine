import { container, injectable } from 'tsyringe';
import { Type } from '../../../models';
import { Pipeline } from '../../pipeline';
import { PipelineAdapter, PipelineNext } from '../../pipeline-types';
import {
	CompoundProcessStep,
	DiProcess,
	ProcessStep,
	ProcessStepUnion,
} from './process-pipeline-types';

@injectable()
class ProcessPipelineAdapter implements PipelineAdapter<ProcessStepUnion, void> {
	async execute(step: ProcessStepUnion, payload: void, next?: PipelineNext<void>): Promise<void> {
		if (this.isCompoundProcessStep(step)) {
			const process = container.resolve(step.process);

			await process.execute(step.payload);

			return next();
		}

		if (this.isDiProcess(step)) {
			const instance = container.resolve(step);

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

@injectable()
export class ProcessPipeline extends Pipeline<ProcessStepUnion> {
	constructor() {
		super(container.resolve(ProcessPipelineAdapter));
	}
}
