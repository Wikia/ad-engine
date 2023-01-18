import { utils } from '@wikia/core';
import { NewsAndRatingsTargetingSetup } from '@wikia/platforms/news-and-ratings/shared/setup/context/targeting/news-and-ratings-targeting.setup';

import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('News and Ratings Targeting Setup', () => {
	const sandbox = createSandbox();
	let queryStringGetStub;

	beforeEach(() => {
		queryStringGetStub = sandbox.stub(utils.queryString, 'get');
	});

	afterEach(() => {
		sandbox.restore();
		queryStringGetStub.resetHistory();
	});

	describe('jsJson()', () => {
		it('returns true if passed argument is JSON string', () => {
			const targetingSetup = new NewsAndRatingsTargetingSetup();
			const argument = '{"pv":1, "session":"e"}';

			expect(targetingSetup.isJsonString(argument)).to.be.true;
		});

		it('returns false if passed argument is not JSON string', () => {
			const targetingSetup = new NewsAndRatingsTargetingSetup();
			const argument = '|||2';

			expect(targetingSetup.isJsonString(argument)).to.be.false;
		});
	});

	describe('getForcedCampaignsTargeting', () => {
		it('returns empty object when there are no query-string params', () => {
			const targetingSetup = new NewsAndRatingsTargetingSetup();
			expect(targetingSetup.getForcedCampaignsTargeting()).to.be.deep.eq({});
		});

		it('returns an object with cid when query-string param exists', () => {
			const targetingSetup = new NewsAndRatingsTargetingSetup();
			queryStringGetStub.withArgs('cid').returns('test-campaign');

			expect(targetingSetup.getForcedCampaignsTargeting()).to.be.deep.eq({
				cid: 'test-campaign',
			});
		});

		it('returns an object with campaign when query-string param exists', () => {
			const targetingSetup = new NewsAndRatingsTargetingSetup();
			queryStringGetStub.withArgs('adTargeting_campaign').returns('test-campaign');

			expect(targetingSetup.getForcedCampaignsTargeting()).to.be.deep.eq({
				campaign: 'test-campaign',
			});
		});

		it('returns an object with cid when both query-string params exist', () => {
			const targetingSetup = new NewsAndRatingsTargetingSetup();
			queryStringGetStub.returns('test-campaign');

			expect(targetingSetup.getForcedCampaignsTargeting()).to.be.deep.eq({
				cid: 'test-campaign',
			});
		});
	});
});
