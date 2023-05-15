import { expect } from 'chai';

import { TvGuideAnyclipSetup } from '@wikia/platforms/news-and-ratings/tvguide/setup/context/slots/tvguide-anyclip.setup';

describe('Anyclip on TVGuide', () => {
	it("is applicable when it's main news page", () => {
		const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

		expect(setup.isApplicable('news')).to.be.true;
	});

	it("is applicable when it's streaming news page'", () => {
		const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

		expect(setup.isApplicable('feature_hub')).to.be.true;
	});

	it("is applicable when it's a listing page'", () => {
		const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

		expect(setup.isApplicable('listings/main')).to.be.true;
	});

	it('is not applicable when it pname equals undefined', () => {
		const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

		expect(setup.isApplicable(undefined)).to.be.false;
	});
});
