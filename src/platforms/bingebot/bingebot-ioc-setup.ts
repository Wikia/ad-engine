import { DiProcess } from '@wikia/ad-engine';
import { container, injectable } from 'tsyringe';
import { BingeBotTargetingSetup } from './setup/context/targeting/bingebot-targeting.setup';

@injectable()
export class BingeBotIocSetup implements DiProcess {
	async execute(): Promise<void> {
		container.register(...BingeBotTargetingSetup.skin('bingebot'));
	}
}
