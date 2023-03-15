import { isLocal } from '../../platforms/shared';
import { context } from '../services';

class OutboundTrafficRestrict {
	private static MIN = 0;
	private static MAX = 100;
	private static DEFAULT_THRESHOLD = 2;

	public isOutboundTrafficAllowed(serviceName = 'default'): boolean {
		if (isLocal()) {
			return true;
		}
		return (
			this.getSeed() <
			(context.get(`services.${serviceName}.threshold`) ||
				OutboundTrafficRestrict.DEFAULT_THRESHOLD)
		);
	}

	private getSeed(): number {
		return (
			Math.random() * (OutboundTrafficRestrict.MAX - OutboundTrafficRestrict.MIN) +
			OutboundTrafficRestrict.MIN
		);
	}
}

export const outboundTrafficRestrict = new OutboundTrafficRestrict();
