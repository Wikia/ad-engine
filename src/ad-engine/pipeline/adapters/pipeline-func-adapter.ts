import { Pipeline } from '../pipeline';
import { PipelineAdapter, PipelineNext } from '../pipeline-types';

export type PipelineFuncStep<TPayload> = (
	payload: TPayload,
	next?: PipelineNext<TPayload>,
) => Promise<TPayload>;

export class PipelineFuncAdapter<TPayload>
	implements PipelineAdapter<PipelineFuncStep<TPayload>, TPayload> {
	static makePipeline<TPayload>(): Pipeline<PipelineFuncStep<TPayload>, TPayload> {
		return new Pipeline(new PipelineFuncAdapter<TPayload>());
	}

	async execute(
		step: PipelineFuncStep<TPayload>,
		payload: TPayload,
		next?: PipelineNext<TPayload>,
	): Promise<TPayload> {
		return step(payload, next as any);
	}
}
