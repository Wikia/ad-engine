import { getWikiaContext } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';
import { getRubiconFutheadContext } from '../../../bidders/prebid/rubicon-futhead';
import { getRubiconMutheadContext } from '../../../bidders/prebid/rubicon-muthead';
import { selectApplication } from '../../../utils/application-helper';

@injectable()
export class SportsPrebidConfigSetup implements DiProcess {
	execute(): void {
		const mode = context.get('state.isMobile') ? 'mobile' : 'desktop';

		context.set(
			'bidders.prebid.rubicon_display',
			selectApplication(getRubiconFutheadContext(mode), getRubiconMutheadContext(mode)),
		);
		context.set('bidders.prebid.wikia', getWikiaContext(mode));
	}
}
