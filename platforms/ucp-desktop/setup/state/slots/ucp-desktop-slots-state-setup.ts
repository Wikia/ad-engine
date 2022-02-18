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

		if (
			context.get('services.exCo.enabled') ||
			context.get('services.anyclip.enabled') ||
			context.get('services.connatix.enabled')
		) {
			this.disableIncontentPlayerSlot();
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
		this.disableIncontentPlayerSlot();
		context.set('slots.incontent_player.targeting.pos', ['incontent_video']);
	}

	private disableIncontentPlayerSlot(): void {
		context.set('slots.incontent_player.disabled', true);
	}
}
