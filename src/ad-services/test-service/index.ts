import { PartnerServiceStage, utils } from '@ad-engine/core';
import { Service } from './partner-service-decorator';
import { preTestService } from '../test-service-2';
import { audigent } from '../audigent';

@Service({
	dependencies: [preTestService, audigent],
	stage: PartnerServiceStage.provider,
	timeout: 2000,
})
export class TestService {
	async call(): Promise<void> {
		utils.logger('DJ', 'Test service launched!');
	}
}

export const testService = new TestService();
