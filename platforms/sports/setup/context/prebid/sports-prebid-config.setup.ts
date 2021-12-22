import { DeviceMode, getDeviceMode, getWikiaContext } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { getRubiconFutheadContext } from '../../../bidders/prebid/rubicon-futhead';
import { getRubiconMutheadContext } from '../../../bidders/prebid/rubicon-muthead';

@Injectable()
export class SportsPrebidConfigSetup implements DiProcess {
	execute(): void {
		const mode: DeviceMode = getDeviceMode();

		context.set(
			'bidders.prebid.rubicon_display',
			context.get('application') === 'futhead'
				? getRubiconFutheadContext(mode)
				: getRubiconMutheadContext(mode),
		);
		context.set('bidders.prebid.wikia', getWikiaContext(mode));
	}
}
