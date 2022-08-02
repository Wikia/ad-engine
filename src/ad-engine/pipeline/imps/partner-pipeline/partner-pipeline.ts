import { Container, Injectable } from '@wikia/dependency-injection';
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
export class PartnerPipeline {
	steps: PartnerStepUnion[] = [];
	constructor(container: Container) {
		container.get(PartnerPipelineAdapter);
	}

	add(...steps: PartnerStepUnion[]): this {
		this.steps = steps;

		return this;
	}

	execute(payload: Promise<any>[] = []): Promise<any> {
		this.steps.forEach((step) => {
			if (typeof step === 'function') {
				const instance = step({});
				instance.execute();
				payload.push(instance.initialized);
			} else {
				step.execute();
				payload.push(step.initialized);
			}
		});

		return Promise.all(payload);
	}
}
