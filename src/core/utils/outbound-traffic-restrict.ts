import { utils } from '../index';
import { context } from '../services';

class OutboundTrafficRestrict {
	private static MIN = 0;
	private static MAX = 100;
	private static DEFAULT_THRESHOLD = 2;

	public isOutboundTrafficAllowed(serviceName = 'default'): boolean {
		const isAllowedFromContext = context.get(`services.${serviceName}.allowed`);
		if (typeof isAllowedFromContext === 'boolean') {
			return isAllowedFromContext;
		}

		const isAllowed =
			this.getSeed() <
			(context.get(`services.${serviceName}.threshold`) ||
				OutboundTrafficRestrict.DEFAULT_THRESHOLD);

		utils.logger(
			'outbound-traffic-restrict',
			`Outbound traffic for: "${serviceName}" is allowed: ${isAllowed}`,
		);

		context.set(`services.${serviceName}.allowed`, isAllowed);

		return isAllowed;
	}

	private getSeed(): number {
		return (
			Math.random() * (OutboundTrafficRestrict.MAX - OutboundTrafficRestrict.MIN) +
			OutboundTrafficRestrict.MIN
		);
	}
}

export const outboundTrafficRestrict = new OutboundTrafficRestrict();
