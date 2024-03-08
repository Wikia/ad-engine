import {
	context,
	DiProcess,
	InstantConfigService,
	setupNpaContext,
	setupRdpContext,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpNoAdsBaseContextSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): void {
		this.setBaseState();
		this.setOptionsContext();
		setupNpaContext();
		setupRdpContext();
	}

	private setBaseState(): void {
		context.set('state.deviceType', utils.client.getDeviceType());
		context.set('state.isLogged', !!context.get('wiki.wgUserId'));
	}

	private setOptionsContext(): void {
		context.set('options.delayEvents', this.instantConfig.get('icDelayEvents'));
	}
}
