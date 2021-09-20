import { DeviceMode, getDeviceMode, getWikiaContext } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getRubiconContext } from '../../../bidders/prebid/rubicon';

@Injectable()
export class FutheadPrebidConfigSetup implements DiProcess {
	execute(): void {
		const mode: DeviceMode = getDeviceMode();

		context.set('bidders.prebid.rubicon_display', getRubiconContext(mode));
		context.set('bidders.prebid.wikia', getWikiaContext(mode));
	}
}
