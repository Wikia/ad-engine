import { PipelineAdapter, PipelineNext } from './pipeline-types';

export class Pipeline<TStep, TPayload = void> {
	private steps: TStep[] = [];

	constructor(private adapter: PipelineAdapter<TStep, TPayload>) {}

	add(...steps: TStep[]): this {
		this.steps.push(...steps);

		return this;
	}

	execute(payload: TPayload, finalStep?: TStep): Promise<TPayload> {
		const finalNext = this.createFinalNext(finalStep);
		const executor = this.createExecutor(finalNext);

		return executor(payload);
	}

	private createFinalNext(step?: TStep): PipelineNext<TPayload> {
		if (!step) {
			return async (payload: TPayload) => payload;
		}

		return (payload: TPayload) => this.adapter.execute(step, payload);
	}

	private createExecutor(finalNext: PipelineNext<TPayload>): PipelineNext<TPayload> {
		return this.steps.reduceRight<PipelineNext<TPayload>>(
			(next: PipelineNext<TPayload>, step: TStep) => (payload: TPayload) =>
				this.adapter.execute(step, payload, next),
			finalNext,
		);
	}
}
