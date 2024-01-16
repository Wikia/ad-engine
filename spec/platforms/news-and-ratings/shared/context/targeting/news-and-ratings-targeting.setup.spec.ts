import { utils } from '@wikia/core';
import { NewsAndRatingsTargetingSetup } from '@wikia/platforms/news-and-ratings/shared/setup/context/targeting/news-and-ratings-targeting.setup';

import { expect } from 'chai';

describe('News and Ratings Targeting Setup', () => {
	let queryStringGetStub;
	let newsAndRatingsTargetingSetup;

	beforeEach(() => {
		queryStringGetStub = global.sandbox.stub(utils.queryString, 'get');
		newsAndRatingsTargetingSetup = new NewsAndRatingsTargetingSetup();
	});

	afterEach(() => {
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

	describe('parseAdTags()', () => {
		it('parseAdTags correctly parses ad tags string to object', () => {
			const adTagsString =
				'game=test-game&franchise=test-franchise&genre=test-genre&user=test-user';
			const expectedParsedAdTags = {
				game: 'test-game',
				franchise: 'test-franchise',
				genre: 'test-genre',
				user: 'test-user',
			};

			const parsedAdTags = newsAndRatingsTargetingSetup.parseAdTags(adTagsString);

			expect(parsedAdTags).to.be.deep.eq(expectedParsedAdTags);
		});

		it('parseAdTags correctly decodes encoded values', () => {
			const adTagsString = 'game=test-game&genre=Role-Playing%2CAction+RPG%2CBattle+Royale';

			const expectedParsedAdTags = {
				game: 'test-game',
				genre: 'Role-Playing,Action RPG,Battle Royale',
			};

			const parsedAdTags = newsAndRatingsTargetingSetup.parseAdTags(adTagsString);

			expect(parsedAdTags).to.be.deep.eq(expectedParsedAdTags);
		});

		it('getMappedAdTags correctly maps N&R specific targeting key names to match Fandom convention', () => {
			const parsedAdTags = {
				cid: 'test-cid',
				con: 'test-con',
				franchises: 'test-fra,test-fra2',
				genre: 'test-genre',
				network: 'test-network',
				score: '78',
				user: 'test-user',
			};

			const expectedMappedAdTags = {
				slug: 'test-cid',
				pform: 'test-con',
				franchise: ['test-fra', 'test-fra2'],
				gnre: 'test-genre',
				score: '78',
				tv: 'test-network',
				user: 'test-user',
			};

			const mappedAdTags = newsAndRatingsTargetingSetup.getMappedAdTags(parsedAdTags);

			expect(mappedAdTags).to.be.deep.eq(expectedMappedAdTags);
		});

		it("getMappedAdTags correctly maps franchise key to 'franchise_nr' and franchiseRoot to 'franchise'", () => {
			const parsedAdTags = {
				franchise: 'test-franchise',
				franchiseRoot: 'test-franchise-root',
			};

			const expectedMappedAdTags = {
				franchise_nr: 'test-franchise',
				franchise: 'test-franchise-root',
			};

			const mappedAdTags = newsAndRatingsTargetingSetup.getMappedAdTags(parsedAdTags);

			expect(mappedAdTags).to.be.deep.eq(expectedMappedAdTags);
		});
	});
});
