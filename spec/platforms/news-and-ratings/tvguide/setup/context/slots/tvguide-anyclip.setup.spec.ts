import { expect } from 'chai';

import { TvGuideAnyclipSetup } from '@wikia/platforms/news-and-ratings/tvguide/setup/context/slots/tvguide-anyclip.setup';

describe('Anyclip on TVGuide', () => {
	it('is applicable when it pathname equals /news/', () => {
		const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

		expect(setup.isApplicable('/news/')).to.be.true;
	});

	it('is applicable when it pathname equals /services/netflix/', () => {
		const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

		expect(setup.isApplicable('/services/netflix/')).to.be.true;
	});

	it('is not applicable when it pathname equals /', () => {
		const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

		expect(setup.isApplicable('/')).to.be.false;
	});
});
