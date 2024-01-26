import { utils } from '@wikia/core';
import { MetricReporter, MetricReporterSender } from '@wikia/platforms/shared';
import { expect } from 'chai';
import sinon from 'sinon';

describe('metric-reporter', () => {
	let metricSender: MetricReporterSender;
	beforeEach(() => {
		metricSender = {
			activate: () => {},
			sendToMeteringSystem: () => {},
		};
	});

	it('do not execute when it is not allowed', async () => {
		global.sandbox.stub(utils.outboundTrafficRestrict, 'isOutboundTrafficAllowed').returns(false);
		const sendSpy = global.sandbox.spy(metricSender, 'sendToMeteringSystem');

		const metricReporter = new MetricReporter(metricSender);
		await metricReporter.initialise();

		expect(sendSpy.callCount).to.be.eq(0);
	});

	it('do execute when it is allowed, and call send for lib init', async () => {
		global.sandbox.stub(utils.outboundTrafficRestrict, 'isOutboundTrafficAllowed').returns(true);
		global.sandbox.stub(MetricReporter.prototype, 'trackGamSlotRequest');
		global.sandbox.stub(MetricReporter.prototype, 'trackGamSlotRendered');

		const sendSpy = global.sandbox.spy(metricSender, 'sendToMeteringSystem');

		const metricReporter = new MetricReporter(metricSender);
		await metricReporter.initialise();

		expect(sendSpy.callCount, 'sendToMeteringSystem').to.be.eq(2);
		expect(sendSpy.calledWithMatch(sinon.match({ action: 'init' }))).to.be.true;
	});
});
