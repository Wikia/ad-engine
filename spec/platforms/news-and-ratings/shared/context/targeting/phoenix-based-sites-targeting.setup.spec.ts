import { PhoenixBasedSitesTargetingSetup } from '@wikia/platforms/news-and-ratings/shared/setup/context/targeting/phoenix-based-sites-targeting.setup';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('Phoenix based sites targeting setup', () => {
	const sandbox = createSandbox();
	const phoenixBasedSitesTargetingSetup = new PhoenixBasedSitesTargetingSetup();

	beforeEach(() => {
		sandbox.stub(phoenixBasedSitesTargetingSetup, 'getMetadataTargetingParams').returns({
			cid: 'test-cid',
			con: 'test-con',
			genre: 'test-genre',
			user: 'test-user',
		});
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('N&R specific targeting key values (cid, con, genre) are mapped correctly', () => {
		const pageLevelTargeting = phoenixBasedSitesTargetingSetup.getPageLevelTargeting();

		expect(pageLevelTargeting).to.be.deep.eq({
			contentid_nr: 'test-cid',
			pform: 'test-con',
			gnre: 'test-genre',
			user: 'test-user',
		});
	});
});
