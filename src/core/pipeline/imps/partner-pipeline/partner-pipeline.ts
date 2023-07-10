import { injectable } from 'tsyringe';
import { PartnerStepUnion } from './partner-pipeline-types';

@injectable()
export class PartnerPipeline {
	steps: PartnerStepUnion[] = [];
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
