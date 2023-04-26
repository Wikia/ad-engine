import { context } from '@wikia/core';
import { MetricReporterSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';
import sinon from 'sinon';

describe('MetricReporterSetup', () => {
	it('should set values to the context', async () => {
		const instantConfig = {
			get: () => 'xyz',
		} as any;
		const metricSetup = new MetricReporterSetup(instantConfig);

		const contextSetSpy = sinon.spy(context, 'set');
		await metricSetup.execute();

		expect(contextSetSpy.callCount).to.be.eq(3);
		expect(context.get('services.monitoring.endpoint')).to.not.be.empty;
		expect(context.get('services.monitoring.service')).to.not.be.empty;
		expect(context.get('services.monitoring.threshold')).to.not.be.empty;
	});
});
