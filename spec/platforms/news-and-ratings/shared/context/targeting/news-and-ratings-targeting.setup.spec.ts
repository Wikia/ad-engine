import { NewsAndRatingsTargetingSetup } from '@wikia/platforms/shared-news-and-ratings/context/targeting/news-and-ratings-targeting.setup';
import { expect } from 'chai';

describe('News and Ratings Targeting Setup', () => {
	it('jsJson() - returns true if passed argument is JSON string', () => {
		const targetingSetup = new NewsAndRatingsTargetingSetup();
		const argument = '{"pv":1, "session":"e"}';

		expect(targetingSetup.isJsonString(argument)).to.be.true;
	});

	it('jsJson() - returns false if passed argument is not JSON string', () => {
		const targetingSetup = new NewsAndRatingsTargetingSetup();
		const argument = '|||2';

		expect(targetingSetup.isJsonString(argument)).to.be.false;
	});
});
