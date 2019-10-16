import { UapRestrictor } from '@platforms/shared';
import { context } from '@wikia/ad-engine';

export class MutheadUapRestrictor implements UapRestrictor {
	isUapAllowed(): boolean {
		return context.get('targeting.s2') !== 'old';
	}
}
