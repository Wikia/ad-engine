import { utils } from '@wikia/core';
import { FetchTimeout } from '@wikia/core/utils';
import { MetricReporter } from '@wikia/platforms/shared';
import { expect } from 'chai';
import sinon from 'sinon';

describe('metric-reporter', () => {
	it('do not execute when it is not allowed', async () => {
		global.sandbox.stub(utils.outboundTrafficRestrict, 'isOutboundTrafficAllowed').returns(false);
		const trackLibInitSpy = global.sandbox.spy(MetricReporter.prototype, 'trackLibInitialization');

		const metricReporter = new MetricReporter();
		await metricReporter.initialise();

		expect(trackLibInitSpy.callCount).to.be.eq(0);
	});

	it('do execute when it is allowed, and call send for lib init', async () => {
		global.sandbox.stub(utils.outboundTrafficRestrict, 'isOutboundTrafficAllowed').returns(true);
		const fetchStub = global.sandbox.stub(FetchTimeout.prototype, 'fetch');
		global.sandbox.stub(MetricReporter.prototype, 'trackGamSlotRequest');
		global.sandbox.stub(MetricReporter.prototype, 'trackGamSlotRendered');

		const trackLibInitSpy = global.sandbox.spy(MetricReporter.prototype, 'trackLibInitialization');
		const isSlotDataSpy = global.sandbox.spy(MetricReporter.prototype, 'isMetricSlotData');
		const isTimeDataSpy = global.sandbox.spy(MetricReporter.prototype, 'isMetricTimeData');
		const sendSpy = global.sandbox.spy(MetricReporter.prototype, 'sendToMeteringSystem');

		const metricReporter = new MetricReporter();
		await metricReporter.initialise();

		expect(trackLibInitSpy.callCount, 'trackLibInitialization').to.be.eq(1);
		expect(isSlotDataSpy.callCount, 'isMetricSlotData').to.be.eq(2);
		expect(isTimeDataSpy.callCount, 'isMetricTimeData').to.be.eq(2);
		expect(sendSpy.callCount, 'sendToMeteringSystem').to.be.eq(2);
		expect(sendSpy.calledWithMatch(sinon.match({ action: 'init' }))).to.be.true;
		expect(fetchStub.callCount, 'FetchTimeout').to.be.eq(2);
	});
});
