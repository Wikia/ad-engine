import { UcpTargetingSetup } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
import { DependencyContainer, injectable } from 'tsyringe';

@injectable()
export class UcpDesktopIocSetup implements DiProcess {
	constructor(private container: DependencyContainer) {}

	execute(): void {
		this.container.register(...UcpTargetingSetup.skin('ucp_desktop'));
	}
}
