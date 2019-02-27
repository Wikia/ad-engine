import { expect } from 'chai';
import { getSettings } from '../../../src/ad-bidders/prebid/prebid-settings';
import { context } from '../../../src/ad-engine/services/context-service';

describe('getBidderUuid', () => {
	let bidResponse;
	let getBidderUuid;

	before(() => {
		bidResponse = { bidderCode: 'rubicon', videoCacheKey: 'b' };
		const settings = getSettings();
		const hbUuid = settings.standard.adserverTargeting.find((x) => x.key === 'hb_uuid');

		getBidderUuid = hbUuid.val;
	});

	it('should return videoCacheKey', () => {
		context.set('custom.rubiconDfp', true);
		const result = getBidderUuid(bidResponse);

		expect(result).to.equal('b');
	});

	it('should return disabled (bidderCode)', () => {
		context.set('custom.rubiconDfp', true);
		const result = getBidderUuid({ ...bidResponse, bidderCode: undefined });

		expect(result).to.equal('disabled');
	});

	it('should return disabled (context)', () => {
		context.set('custom.rubiconDfp', false);
		const result = getBidderUuid(bidResponse);

		expect(result).to.equal('disabled');
	});
});
