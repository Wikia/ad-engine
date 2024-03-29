import { Injectable } from '@wikia/dependency-injection';
import { context } from '../../../services';
import { GlobalTimeout } from '../../../utils/global-timeout';
import { PartnerStepUnion } from './partner-pipeline-types';

@Injectable({ scope: 'Transient' })
export class PartnerPipeline {
	constructor(private readonly globalTimeout: GlobalTimeout) {
		this.globalTimeout.set('partner-pipeline', context.get('options.maxDelayTimeout'));
	}

	private steps: PartnerStepUnion[] = [];

	add(...steps: PartnerStepUnion[]): this {
		this.steps = steps;

		return this;
	}

	execute(payload: Promise<void>[] = []): Promise<void[]> {
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
