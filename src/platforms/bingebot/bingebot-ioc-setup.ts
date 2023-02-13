import { DiProcess } from '@wikia/ad-engine';
import { DependencyContainer, injectable } from 'tsyringe';
import { BingeBotTargetingSetup } from './setup/context/targeting/bingebot-targeting.setup';

@injectable()
export class BingeBotIocSetup implements DiProcess {
	constructor(private container: DependencyContainer) {}

	async execute(): Promise<void> {
		this.container.register(...BingeBotTargetingSetup.skin('bingebot'));
	}
}
