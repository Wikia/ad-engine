import {
	context,
	DiProcess,
	getAdUnitString,
	globalRuntimeVariableSetter,
	slotService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopSlotsStateSetup implements DiProcess {
	execute(): void {
		slotService.setState('featured', context.get('custom.hasFeaturedVideo'));

		if (context.get('services.distroScale.enabled')) {
			this.setupIncontentPlayerForDistroScale();
		}
	}

	private setDistroscaleVarInRuntime(slotName: string): void {
		const params = {
			group: 'VIDEO',
			adProduct: 'incontent_video',
			slotNameSuffix: '',
		};

		const distroscaleIU = getAdUnitString(slotName, params);

		globalRuntimeVariableSetter.addNewVariableToRuntime('distroscale', { adUnit: distroscaleIU });
	}

	private setupIncontentPlayerForDistroScale(): void {
		const slotName = 'incontent_player';
		this.setDistroscaleVarInRuntime(slotName);
		context.set('slots.incontent_player.disabled', true);
		context.set('slots.incontent_player.targeting.pos', ['incontent_video']);
	}
}
