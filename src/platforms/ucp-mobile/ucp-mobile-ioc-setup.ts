import { UcpTargetingSetup } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileIocSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		this.container.bind(UcpTargetingSetup.skin('ucp_mobile'));
	}
}
