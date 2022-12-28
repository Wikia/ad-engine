import { expect } from 'chai';
import sinon from 'sinon';

import { context } from '@wikia/core';
import { InstantConfigService } from '@wikia/ad-services';
import { BiddersStateSetup } from '@wikia/platforms/shared/bidders/bidders-state.setup';

describe('BiddersStateSetup', () => {
	const instantConfigStub = sinon.createStubInstance(InstantConfigService);

	beforeEach(() => {
		context.set('custom.hasFeaturedVideo', false);
		context.set('bidders.prebid.enabled', false);
		context.set('bidders.a9.enabled', false);
	});

	afterEach(() => {
		context.remove('custom.hasFeaturedVideo');
		context.remove('bidders.prebid.enabled');
		context.remove('bidders.a9.enabled');
	});

	it('defaults to context settings', () => {
		instantConfigStub.get.withArgs('icA9Bidder').returns(false);
		instantConfigStub.get.withArgs('icPrebid').returns(false);

		const biddersSetup = new BiddersStateSetup(instantConfigStub);
		biddersSetup.execute();

		expect(context.get('bidders.prebid.enabled')).to.be.false;
		expect(context.get('bidders.a9.enabled')).to.be.false;
		expect(context.get('bidders.a9.videoEnabled')).to.be.false;
	});

	it('sets up only A9 display when on page with a video', () => {
		instantConfigStub.get.withArgs('icA9Bidder').returns(true);
		instantConfigStub.get.withArgs('icPrebid').returns(false);
		instantConfigStub.get.withArgs('icA9VideoBidder').returns(true);

		const biddersSetup = new BiddersStateSetup(instantConfigStub);
		biddersSetup.execute();

		expect(context.get('bidders.prebid.enabled')).to.be.false;
		expect(context.get('bidders.a9.enabled')).to.be.true;
		expect(context.get('bidders.a9.videoEnabled')).to.be.false;
	});

	it('sets up A9 display and video when on page with a video', () => {
		instantConfigStub.get.withArgs('icA9Bidder').returns(true);
		instantConfigStub.get.withArgs('icPrebid').returns(false);
		instantConfigStub.get.withArgs('icA9VideoBidder').returns(true);

		context.set('custom.hasFeaturedVideo', true);

		const biddersSetup = new BiddersStateSetup(instantConfigStub);
		biddersSetup.execute();

		expect(context.get('bidders.prebid.enabled')).to.be.false;
		expect(context.get('bidders.a9.enabled')).to.be.true;
		expect(context.get('bidders.a9.videoEnabled')).to.be.true;
	});
});
