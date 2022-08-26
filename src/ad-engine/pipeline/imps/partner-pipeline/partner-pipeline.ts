import { Injectable } from '@wikia/dependency-injection';
import {
	PartnerInitializationProcess,
	PartnerServiceStage,
	PartnerStepUnion,
} from './partner-pipeline-types';

@Injectable({ scope: 'Transient' })
export class PartnerPipeline {
	steps: PartnerStepUnion[] = [];
	add(...steps: PartnerStepUnion[]): this {
		this.steps = steps;

		return this;
	}

	async executeStage(steps: PartnerInitializationProcess[]): Promise<void> {
		await Promise.all(
			steps.map((step) => {
				step.execute();
				return step.initialized;
			}),
		);
	}

	async execute(payload: Promise<void>[] = []): Promise<void[]> {
		const groupedSteps = {
			[PartnerServiceStage.baseSetup]: [],
			[PartnerServiceStage.preProvider]: [],
			[PartnerServiceStage.provider]: [],
			[PartnerServiceStage.afterProvider]: [],
		};

		this.steps
			.sort((a, b) => a._options?.stage - b._options?.stage)
			.forEach((step) => {
				if (typeof step === 'function') {
					const instance = step({});
					const stage = instance.options?.step || PartnerServiceStage.provider;
					groupedSteps[stage].push(step);
				} else {
					const stage = step.options?.step || PartnerServiceStage.provider;
					groupedSteps[stage].push(step);
				}
			});
		payload.push(this.executeStage(groupedSteps[PartnerServiceStage.baseSetup] || []));
		payload.push(this.executeStage(groupedSteps[PartnerServiceStage.preProvider] || []));
		payload.push(this.executeStage(groupedSteps[PartnerServiceStage.provider] || []));
		payload.push(this.executeStage(groupedSteps[PartnerServiceStage.afterProvider] || []));
		return Promise.all(payload);
	}
}
