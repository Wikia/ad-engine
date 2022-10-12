import { Injectable } from '@wikia/dependency-injection';
import {
	ServiceInitializationProcess,
	ServiceStage,
	ServiceStepUnion,
} from './service-pipeline-types';

@Injectable({ scope: 'Singleton' })
export class ServicePipeline {
	steps: ServiceStepUnion[] = [];
	add(...steps: ServiceStepUnion[]): this {
		this.steps = steps;

		return this;
	}

	async executeStage(steps: ServiceInitializationProcess[]): Promise<void> {
		await Promise.all(
			steps.map((step) => {
				step.execute();
				return step.initialized;
			}),
		);
	}

	async execute(): Promise<void> {
		const groupedSteps = {
			[ServiceStage.baseSetup]: [],
			[ServiceStage.preProvider]: [],
			[ServiceStage.provider]: [],
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

		await this.executeStage(groupedSteps[ServiceStage.baseSetup] || []);
		await this.executeStage(groupedSteps[ServiceStage.preProvider] || []);
		await this.executeStage(groupedSteps[ServiceStage.provider] || []);
	}
}
