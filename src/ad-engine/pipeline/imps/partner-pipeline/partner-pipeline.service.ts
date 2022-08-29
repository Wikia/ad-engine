import { Injectable } from '@wikia/dependency-injection';
import {
	PartnerInitializationProcess,
	PartnerServiceStage,
	PartnerStepUnion,
} from './partner-pipeline-types';

@Injectable({ scope: 'Singleton' })
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

	async execute(): Promise<void> {
		const groupedSteps = {
			[PartnerServiceStage.baseSetup]: [],
			[PartnerServiceStage.preProvider]: [],
			[PartnerServiceStage.provider]: [],
		};

		this.steps
			.sort((a, b) => a._options?.stage - b._options?.stage)
			.forEach((step) => {
				if (typeof step === 'function') {
					const instance = step({});
					const stage = instance.options?.stage;
					groupedSteps[stage].push(step);
				} else {
					const stage = step.options?.stage;
					groupedSteps[stage].push(step);
				}
			});

		await this.executeStage(groupedSteps[PartnerServiceStage.baseSetup] || []);
		await this.executeStage(groupedSteps[PartnerServiceStage.preProvider] || []);
		await this.executeStage(groupedSteps[PartnerServiceStage.provider] || []);
	}
}
