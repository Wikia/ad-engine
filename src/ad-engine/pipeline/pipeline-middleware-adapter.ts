import { Middleware } from './middleware-types';
import { PipelineAdapter, PipelineNext } from './pipeline-types';

export class PipelineMiddlewareAdapter<TPayload>
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
