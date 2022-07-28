import { Container, Injectable } from '@wikia/dependency-injection';
import { Pipeline } from '../../pipeline';
import { PipelineAdapter, PipelineNext } from '../../pipeline-types';
import { PartnerStepUnion } from './partner-pipeline-types';

@Injectable({ scope: 'Transient' })
class PartnerPipelineAdapter implements PipelineAdapter<PartnerStepUnion, Promise<any>[]> {
	async execute(
		step: PartnerStepUnion,
		payload: Promise<any>[],
		next?: PipelineNext<Promise<any>[]>,
	): Promise<Promise<any>[]> {
		if (typeof step === 'function') {
			const instance = step({});
			instance.execute();
			payload.push(instance.initialized);
		} else {
			step.execute();
			payload.push(step.initialized);
		}

		return next(payload);
	}
}

@Injectable({ scope: 'Transient' })
export class PartnerPipeline extends Pipeline<PartnerStepUnion, Promise<any>[]> {
	constructor(container: Container) {
		super(container.get(PartnerPipelineAdapter));
	}
}
