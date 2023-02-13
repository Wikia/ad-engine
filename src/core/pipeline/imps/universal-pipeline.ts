import { container, injectable } from 'tsyringe';
import { Type } from '../../models';
import { Pipeline } from '../pipeline';
import { PipelineAdapter, PipelineNext } from '../pipeline-types';
import { FuncPipelineStep } from './func-pipeline';

export type UniversalPipelineStep<TPayload> =
	| Type<DiPipelineStep<TPayload>>
	| FuncPipelineStep<TPayload>;

export interface DiPipelineStep<TPayload> {
	execute(payload: TPayload, next?: PipelineNext<TPayload>): Promise<TPayload>;
}

@injectable()
class UniversalPipelineAdapter<TPayload>
	implements PipelineAdapter<UniversalPipelineStep<TPayload>, TPayload>
{
	execute(
		step: UniversalPipelineStep<TPayload>,
		payload: TPayload,
		next?: PipelineNext<TPayload>,
	): Promise<TPayload> {
		if (this.isDiStep(step)) {
			const instance = container.resolve(step);

			return instance.execute(payload, next);
		}

		return step(payload, next);
	}

	private isDiStep(step: UniversalPipelineStep<TPayload>): step is Type<DiPipelineStep<TPayload>> {
		return typeof step.prototype.execute === 'function';
	}
}

@injectable()
export class UniversalPipeline<TPayload> extends Pipeline<
	UniversalPipelineStep<TPayload>,
	TPayload
> {
	constructor() {
		super(container.resolve<UniversalPipelineAdapter<TPayload>>(UniversalPipelineAdapter));
	}
}
