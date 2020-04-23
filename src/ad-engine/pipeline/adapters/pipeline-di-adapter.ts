import { Container } from '@wikia/dependency-injection';
import { Type } from '../../models/dictionary';
import { PipelineAdapter, PipelineNext } from '../pipeline-types';

export interface PipelineDiStep<TPayload> {
	execute(payload: TPayload, next?: PipelineNext<TPayload>): Promise<TPayload>;
}

export class PipelineDiAdapter<TPayload>
	implements PipelineAdapter<Type<PipelineDiStep<TPayload>>, TPayload> {
	constructor(private container: Container) {}

	execute(
		step: Type<PipelineDiStep<TPayload>>,
		payload: TPayload,
		next?: PipelineNext<TPayload>,
	): Promise<TPayload> {
		const instance = this.container.get(step);

		return instance.execute(payload, next);
	}
}
