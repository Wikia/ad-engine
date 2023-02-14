import { UcpTargetingSetup } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
import { container, injectable } from 'tsyringe';

@injectable()
export class UcpDesktopIocSetup implements DiProcess {
	execute(): void {
		container.register(...UcpTargetingSetup.skin('ucp_desktop'));
	}
}
