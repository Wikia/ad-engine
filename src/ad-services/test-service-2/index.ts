import { PartnerServiceStage, utils } from '@ad-engine/core';
import { Service } from '../test-service/partner-service-decorator';

@Service({
	dependencies: [],
	stage: PartnerServiceStage.preProvider,
})
export class PreTestService {
	async call(): Promise<void> {
		utils.logger('DJ', 'Pre test service launched!');
	}
}

export const preTestService = new PreTestService();
