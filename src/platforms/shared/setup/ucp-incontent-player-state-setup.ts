import { DiProcess, getAdUnitString, runtimeVariableSetter } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpIncontentPlayerStateSetup implements DiProcess {
	execute(): void {
		this.setCustomPlayerRuntimeAdUnit();
	}

	private setCustomPlayerRuntimeAdUnit(slotName = 'incontent_player'): void {
		const params = {
			group: 'VIDEO',
			adProduct: 'incontent_video',
			slotNameSuffix: '',
		};
		const adUnit = getAdUnitString(slotName, params);

		runtimeVariableSetter.addVariable('video', { adUnit });
	}
}
