import { UcpTargetingSetup } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
import { DependencyContainer, injectable } from 'tsyringe';

@injectable()
export class UcpMobileIocSetup implements DiProcess {
	constructor(private container: DependencyContainer) {}

	async execute(): Promise<void> {
		this.container.register(...UcpTargetingSetup.skin('ucp_mobile'));
	}
}
