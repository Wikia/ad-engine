import { UcpTargetingSetup } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopIocSetup implements DiProcess {
	constructor(private container: Container) {}

	execute(): void {
		this.container.bind(UcpTargetingSetup.skin('ucp_desktop'));
	}
}
