import { UapRestrictor } from '@platforms/shared';

export class MutheadUapRestrictor implements UapRestrictor {
	isUapAllowed(): boolean {
		// TODO: Add restriction on old muthead
		return true;
	}
}
