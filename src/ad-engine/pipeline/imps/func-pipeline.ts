import { Pipeline } from '../pipeline';
import { PipelineAdapter, PipelineNext } from '../pipeline-types';

export type FuncPipelineStep<TPayload> = (
	payload: TPayload,
	next?: PipelineNext<TPayload>,
) => Promise<TPayload>;

class FuncPipelineAdapter<TPayload>
	implements PipelineAdapter<FuncPipelineStep<TPayload>, TPayload> {
	async execute(
		step: FuncPipelineStep<TPayload>,
		payload: TPayload,
		next?: PipelineNext<TPayload>,
	): Promise<TPayload> {
		return step(payload, next);
	}
}

export class FuncPipeline<TPayload> extends Pipeline<FuncPipelineStep<TPayload>, TPayload> {
	constructor() {
		super(new FuncPipelineAdapter<TPayload>());
	}
}
