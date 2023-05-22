import { expect } from 'chai';

import { context, targetingService } from '@wikia/core';
import { TvGuideAnyclipSetup } from '@wikia/platforms/news-and-ratings/tvguide/setup/context/slots/tvguide-anyclip.setup';

describe('Anyclip on TVGuide setup', () => {
	describe('isApplicable()', () => {
		it('returns true when pname equals news', () => {
			const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

			expect(setup.isApplicable('news')).to.be.true;
		});

		it('returns true when it pname equals feature_hub', () => {
			const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

			expect(setup.isApplicable('feature_hub')).to.be.true;
		});

		it('returns false when it pname equals undefined', () => {
			const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

			expect(setup.isApplicable(undefined)).to.be.false;
		});

		it('returns true when pathname matches /news/', () => {
			const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

			expect(setup.isApplicable('/news/')).to.be.true;
		});

		it('returns false when pathname matches /news/an-article/', () => {
			const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();

			expect(setup.isApplicable('/news/an-article/')).to.be.false;
		});
	});

	describe('execute()', () => {
		before(() => {
			context.remove('services.anyclip.isApplicable');
		});

		after(() => {
			context.remove('services.anyclip.isApplicable');
			targetingService.remove('pname');
			global.sandbox.restore();
		});

		it('sets services.anyclip.isApplicable() so it returns true when pname is correct', () => {
			targetingService.set('pname', 'news');
			const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();
			setup.execute();

			const isApplicable = context.get('services.anyclip.isApplicable');

			expect(isApplicable()).to.be.true;
		});

		it('sets services.anyclip.isApplicable() so it returns true when pname is test but pathname matches', () => {
			targetingService.set('pname', 'test');
			global.sandbox.stub(window, 'location').value({
				hostname: 'test.com',
				pathname: '/news/',
			});
			const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();
			setup.execute();

			const isApplicable = context.get('services.anyclip.isApplicable');

			expect(isApplicable()).to.be.true;
		});

		it('sets services.anyclip.isApplicable() so it returns false when no match', () => {
			targetingService.set('pname', 'test');
			global.sandbox.stub(window, 'location').value({
				hostname: 'test.com',
				pathname: '/',
			});
			const setup: TvGuideAnyclipSetup = new TvGuideAnyclipSetup();
			setup.execute();

			const isApplicable = context.get('services.anyclip.isApplicable');

			expect(isApplicable()).to.be.false;
		});
	});
});
