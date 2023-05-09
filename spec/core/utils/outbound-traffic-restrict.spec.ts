import { context } from '@wikia/core/services/context-service';
import { outboundTrafficRestrict } from '@wikia/core/utils/outbound-traffic-restrict';
import { expect } from 'chai';
import sinon from 'sinon';

describe('outbound-traffic-restrict', () => {
	let getSeedStub;
	beforeEach(() => {
		context.remove('services.testCase.allowed');
		context.remove('services.testCase.threshold');
		getSeedStub = sinon.stub(outboundTrafficRestrict, 'getSeed' as any);
		getSeedStub.returns(true);
	});

	it('return "true" if no threshold was set - "always true if not set" - do not call "getSeed" method', () => {
		const result = outboundTrafficRestrict.isOutboundTrafficAllowed('testCase');

		expect(result).to.be.true;
		expect(getSeedStub.callCount).to.be.eq(0);
		expect(context.get('services.testCase.allowed')).is.not.null;
	});

	it('when threshold was set in context, call "getSeed" method', () => {
		context.set('services.testCase.threshold', 50);
		const result = outboundTrafficRestrict.isOutboundTrafficAllowed('testCase');

		expect(result).to.be.true;
		expect(getSeedStub.callCount).to.be.eq(1);
		expect(context.get('services.testCase.allowed')).is.not.null;
	});

	afterEach(() => {
		getSeedStub.restore();
	});
});
