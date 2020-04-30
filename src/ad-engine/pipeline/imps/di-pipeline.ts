import { Container, Injectable } from '@wikia/dependency-injection';
import { Type } from '../../models/dictionary';
import { Pipeline } from '../pipeline';
import { PipelineAdapter, PipelineNext } from '../pipeline-types';

export interface DiPipelineStep<TPayload> {
	execute(payload: TPayload, next?: PipelineNext<TPayload>): Promise<TPayload>;
}

class DiPipelineAdapter<TPayload>
	implements PipelineAdapter<Type<DiPipelineStep<TPayload>>, TPayload> {
	constructor(private container: Container) {}

	execute(
		step: Type<DiPipelineStep<TPayload>>,
		payload: TPayload,
		next?: PipelineNext<TPayload>,
	): Promise<TPayload> {
		const instance = this.container.get(step);

		return instance.execute(payload, next);
	}
}

@Injectable({ scope: 'Transient' })
export class DiPipeline<TPayload> extends Pipeline<Type<DiPipelineStep<TPayload>>, TPayload> {
	constructor(container: Container) {
		super(new DiPipelineAdapter<TPayload>(container));
	}
}
