import { utils } from '../index';
import { context } from '../services';

class OutboundTrafficRestrict {
	private readonly MAX = 100;
	private readonly DEFAULT_THRESHOLD = 100;

	public isOutboundTrafficAllowed(serviceName = 'default'): boolean {
		const isAllowedFromContext = context.get(`services.${serviceName}.allowed`);
		if (typeof isAllowedFromContext === 'boolean') {
			return isAllowedFromContext;
		}

		const threshold = context.get(`services.${serviceName}.threshold`) || this.DEFAULT_THRESHOLD;
		let isAllowed = true;
		if (threshold !== this.DEFAULT_THRESHOLD) {
			isAllowed = this.getSeed() < threshold;
		}

		utils.logger(
			'outbound-traffic-restrict',
			`Outbound traffic for: "${serviceName}" is allowed: ${isAllowed}`,
			`Threshold: ${threshold}`,
		);

		context.set(`services.${serviceName}.allowed`, isAllowed);

		return isAllowed;
	}

	private getSeed(): number {
		return Math.random() * this.MAX;
	}
}

export const outboundTrafficRestrict = new OutboundTrafficRestrict();
