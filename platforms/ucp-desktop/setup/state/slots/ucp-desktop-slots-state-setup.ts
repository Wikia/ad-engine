import { context, DiProcess, getAdUnitString, globalRuntimeVariableSetter } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopSlotsStateSetup implements DiProcess {
	execute(): void {
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
		// ToDo: Remove after switching Distroscale to a general variable
		globalRuntimeVariableSetter.addNewVariableToRuntime('distroscale', { adUnit });
	}

	private setupIncontentPlayerForDistroScale(): void {
		this.disableIncontentPlayerSlot();
		context.set('slots.incontent_player.targeting.pos', ['incontent_video']);
	}

	private disableIncontentPlayerSlot(): void {
		context.set('slots.incontent_player.disabled', true);
	}
}
