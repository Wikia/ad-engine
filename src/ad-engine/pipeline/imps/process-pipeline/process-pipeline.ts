import { Container, Injectable } from '@wikia/dependency-injection';
import { Type } from '../../../models/dictionary';
import { Pipeline } from '../../pipeline';
import { PipelineAdapter, PipelineNext } from '../../pipeline-types';
import {
	CompoundProcessStep,
	DiProcess,
	PipelineProcess,
	ProcessStep,
	ProcessStepUnion,
} from './process-pipeline-types';

@Injectable({ scope: 'Transient' })
class ProcessPipelineAdapter implements PipelineAdapter<ProcessStepUnion, void> {
	constructor(private container: Container) {}

	async execute(step: ProcessStepUnion, payload: void, next?: PipelineNext<void>): Promise<void> {
		let stepPromise: Promise<void> | void;

		if (this.isCompoundProcessStep(step)) {
			const process = this.container.get(step.process);

			stepPromise = process.execute(step.payload);
		} else if (this.isPipelineProcess(step)) {
			stepPromise = step.execute();
		} else if (this.isDiProcess(step)) {
			const instance = this.container.get(step);

			stepPromise = instance.execute();
		} else {
			stepPromise = step();
		}

		await stepPromise;

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
		return typeof step !== 'object' && typeof step.prototype.execute === 'function';
	}

	private isPipelineProcess(step: ProcessStep): step is PipelineProcess {
		return typeof step === 'object' && 'execute' in step && typeof step.execute === 'function';
	}
}

@Injectable({ scope: 'Transient' })
export class ProcessPipeline extends Pipeline<ProcessStepUnion> {
	constructor(container: Container) {
		super(container.get(ProcessPipelineAdapter));
	}
}
