import { slotsContext } from '@platforms/shared';
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
	constructor() {}

	execute(): void {
		slotService.setState('featured', context.get('custom.hasFeaturedVideo'));

		if (context.get('services.distroScale.enabled')) {
			this.setupIncontentPlayerForDistroScale();
		} else {
			slotsContext.setState('incontent_player', context.get('custom.hasIncontentPlayer'));
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
		context.set('slots.incontent_player.targeting.pos', ['incontent_video']);
	}
}
