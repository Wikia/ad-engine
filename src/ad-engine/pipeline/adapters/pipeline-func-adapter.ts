import { Pipeline } from '../pipeline';
import { PipelineAdapter, PipelineNext } from '../pipeline-types';

export type PipelineFuncStep<TPayload> = (
	payload: TPayload,
	next?: PipelineNext<TPayload>,
) => Promise<TPayload>;

export class PipelineFuncAdapter<TPayload>
	implements PipelineAdapter<PipelineFuncStep<TPayload>, TPayload> {
	async execute(
		step: PipelineFuncStep<TPayload>,
		payload: TPayload,
		next?: PipelineNext<TPayload>,
	): Promise<TPayload> {
		return step(payload, next as any);
	}
}

export class FuncPipeline<TPayload> extends Pipeline<PipelineFuncStep<TPayload>, TPayload> {
	constructor() {
		super(new PipelineFuncAdapter<TPayload>());
	}
}
