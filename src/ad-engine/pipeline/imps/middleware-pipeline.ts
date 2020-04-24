import { Pipeline } from '../pipeline';
import { PipelineAdapter, PipelineNext } from '../pipeline-types';

type MiddlewareNext<T> = (context: T) => Promise<void>;

export type Middleware<T> = (context: T, next?: MiddlewareNext<T>) => void | Promise<void>;

export class MiddlewarePipelineAdapter<TPayload>
	implements PipelineAdapter<Middleware<TPayload>, TPayload> {
	async execute(
		step: Middleware<TPayload>,
		payload: TPayload,
		next?: PipelineNext<TPayload>,
	): Promise<TPayload> {
		await step(payload, next as any);

		return payload;
	}
}

// TODO: Best would be to replace it with FuncPipeline, but would require few adjustment on middleware side.
/**
 * @deprecated use FuncPipeline instead
 */
export class MiddlewarePipeline<TPayload> extends Pipeline<Middleware<TPayload>, TPayload> {
	constructor() {
		super(new MiddlewarePipelineAdapter<TPayload>());
	}
}
