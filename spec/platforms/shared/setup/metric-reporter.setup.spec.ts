import { context } from '@wikia/core';
import { MetricReporterSetup } from '@wikia/platforms/shared';
import { expect } from 'chai';

describe('MetricReporterSetup', () => {
	it('should set values to the context (number threshold)', async () => {
		const instantConfig = {
			get: () => 100,
		} as any;
		const metricSetup = new MetricReporterSetup(instantConfig);

		const contextSetSpy = global.sandbox.spy(context, 'set');
		await metricSetup.execute();

		expect(contextSetSpy.callCount).to.be.eq(4);
		expect(context.get('services.monitoring.endpoint')).to.not.be.empty;
		expect(context.get('services.monitoring.service')).to.not.be.empty;
		expect(context.get('services.monitoring-default.threshold')).to.be.eq(100);
	});

	it('should set values to the context (object threshold)', async () => {
		const instantConfig = {
			get: () => ({ default: 10, feature: 5 }),
		} as any;
		const metricSetup = new MetricReporterSetup(instantConfig);

		const contextSetSpy = global.sandbox.spy(context, 'set');
		await metricSetup.execute();

		expect(contextSetSpy.callCount).to.be.eq(4);
		expect(context.get('services.monitoring.endpoint')).to.not.be.empty;
		expect(context.get('services.monitoring.service')).to.not.be.empty;
		expect(context.get('services.monitoring-default.threshold')).to.be.eq(10);
		expect(context.get('services.monitoring-feature.threshold')).to.be.eq(5);
	});
});
