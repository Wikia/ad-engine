import { Container, Injectable } from '@wikia/dependency-injection';
import { Type } from '../../models/dictionary';
import { Pipeline } from '../pipeline';
import { PipelineAdapter, PipelineNext } from '../pipeline-types';
import { FuncPipelineStep } from './func-pipeline';

export type UniversalPipelineStep<TPayload> =
	| Type<DiPipelineStep<TPayload>>
	| FuncPipelineStep<TPayload>;

export interface DiPipelineStep<TPayload> {
	execute(payload: TPayload, next?: PipelineNext<TPayload>): Promise<TPayload>;
}

@Injectable({ scope: 'Transient' })
class UniversalPipelineAdapter<TPayload>
	implements PipelineAdapter<UniversalPipelineStep<TPayload>, TPayload> {
	constructor(private container: Container) {}

	execute(
		step: UniversalPipelineStep<TPayload>,
		payload: TPayload,
		next?: PipelineNext<TPayload>,
	): Promise<TPayload> {
		if (this.isDiStep(step)) {
			const instance = this.container.get(step);

			return instance.execute(payload, next);
		}

		return step(payload, next);
	}

	private isDiStep(step: UniversalPipelineStep<TPayload>): step is Type<DiPipelineStep<TPayload>> {
		return typeof step.prototype.execute === 'function';
	}
}

@Injectable({ scope: 'Transient' })
export class UniversalPipeline<TPayload> extends Pipeline<
	UniversalPipelineStep<TPayload>,
	TPayload
> {
	constructor(container: Container) {
		super(container.get<UniversalPipelineAdapter<TPayload>>(UniversalPipelineAdapter));
	}
}
