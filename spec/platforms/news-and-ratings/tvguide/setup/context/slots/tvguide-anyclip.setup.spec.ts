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

	describe('as in-content player', () => {
		it('should qualify as in-content on listing pages', () => {
			const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

			expect(setup.shouldPlayerBeIncontent('listings/main')).to.be.true;
		});

		it('should not qualify as in-content on streaming news pages', () => {
			const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

			expect(setup.shouldPlayerBeIncontent('feature_hub')).to.be.false;
		});
	});
});
