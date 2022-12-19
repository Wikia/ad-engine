import { context, DiProcess, getAdUnitString, globalRuntimeVariableSetter } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopSlotsStateSetup implements DiProcess {
	execute(): void {
		if (context.get('services.anyclip.enabled')) {
			this.disableIncontentPlayerSlot();
		}

		this.setCustomPlayerRuntimeAdUnit();
	}

	private setCustomPlayerRuntimeAdUnit(slotName = 'incontent_player'): void {
		const params = {
			group: 'VIDEO',
			adProduct: 'incontent_video',
			slotNameSuffix: '',
		};
		const adUnit = getAdUnitString(slotName, params);

		globalRuntimeVariableSetter.addNewVariableToRuntime('video', { adUnit });
	}

	private disableIncontentPlayerSlot(): void {
		context.set('slots.incontent_player.disabled', true);
	}
}
