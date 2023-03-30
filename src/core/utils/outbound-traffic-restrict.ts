import { context } from '../services';

class OutboundTrafficRestrict {
	private static MAX = 100;
	private static DEFAULT_THRESHOLD = 2;

	public isOutboundTrafficAllowed(serviceName = 'default'): boolean {
		return (
			this.getSeed() <
			(context.get(`services.${serviceName}.threshold`) ||
				OutboundTrafficRestrict.DEFAULT_THRESHOLD)
		);
	}

	private getSeed(): number {
		return Math.random() * OutboundTrafficRestrict.MAX;
	}
}

export const outboundTrafficRestrict = new OutboundTrafficRestrict();
