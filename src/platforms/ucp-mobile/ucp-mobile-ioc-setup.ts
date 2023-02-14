import { UcpTargetingSetup } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
import { container, injectable } from 'tsyringe';

@injectable()
export class UcpMobileIocSetup implements DiProcess {
	async execute(): Promise<void> {
		container.register(...UcpTargetingSetup.skin('ucp_mobile'));
	}
}
