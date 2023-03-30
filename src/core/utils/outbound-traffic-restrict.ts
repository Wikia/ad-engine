import { context } from '../services';

class OutboundTrafficRestrict {
	private readonly MAX = 100;
	private readonly DEFAULT_THRESHOLD = 2;

	public isOutboundTrafficAllowed(serviceName = 'default'): boolean {
		return (
			this.getSeed() < (context.get(`services.${serviceName}.threshold`) || this.DEFAULT_THRESHOLD)
		);
	}

	private getSeed(): number {
		return Math.random() * this.MAX;
	}
}

export const outboundTrafficRestrict = new OutboundTrafficRestrict();
