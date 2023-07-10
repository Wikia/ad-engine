import { expect } from 'chai';

import { context, InstantConfigService, targetingService } from '@wikia/core';
import { NewsAndRatingsSlotsDefinitionRepository } from '@wikia/platforms/news-and-ratings/shared';
import { NewsAndRatingsAnyclipSetup } from '@wikia/platforms/news-and-ratings/shared/setup/dynamic-slots/news-and-ratings-anyclip.setup';

describe('Anyclip setup', () => {
	let instantConfigStub, slotsDefinitionRepository;

	beforeEach(() => {
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		slotsDefinitionRepository = new NewsAndRatingsSlotsDefinitionRepository(instantConfigStub);
	});

	describe('isApplicable()', () => {
		it('returns true when pname equals news', () => {
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);

			expect(setup.isApplicable('news')).to.be.true;
		});

		it('returns true when it pname equals feature_hub', () => {
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);

			expect(setup.isApplicable('feature_hub')).to.be.true;
		});

		it('returns true when it pname equals movie', () => {
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);

			expect(setup.isApplicable('movie')).to.be.true;
		});

		it('returns true when it pname equals tv_show', () => {
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);

			expect(setup.isApplicable('tv_show')).to.be.true;
		});

		it('returns false when it pname equals undefined', () => {
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);

			expect(setup.isApplicable(undefined)).to.be.false;
		});

		it('returns true when pathname matches /news/', () => {
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);

			expect(setup.isApplicable('/news/')).to.be.true;
		});

		it('returns false when pathname matches /news/an-article/', () => {
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);

			expect(setup.isApplicable('/news/an-article/')).to.be.false;
		});

		it("is applicable when it's a listing page", () => {
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);

			expect(setup.isApplicable('listings/main')).to.be.true;
		});
	});

	describe('execute()', () => {
		afterEach(() => {
			context.remove('services.anyclip.isApplicable');
			context.remove('services.anyclip.anyclipTagExists');
			context.remove('services.anyclip.playerElementId');
			context.remove('services.anyclip.loadWithoutAnchor');
			context.remove('services.anyclip.loadOnPageLoad');
			targetingService.clear('pname');
			global.sandbox.restore();
		});

		it('sets services.anyclip.isApplicable() so it returns true when there is a tag from backend', () => {
			context.set('services.anyclip.anyclipTagExists', true);
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);
			setup.execute();

			const isApplicable = context.get('services.anyclip.isApplicable');

			expect(isApplicable()).to.be.true;
		});

		it('sets services.anyclip.isApplicable() so it returns true when pname is correct', () => {
			targetingService.set('pname', 'news');
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);
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
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);
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
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);
			setup.execute();

			const isApplicable = context.get('services.anyclip.isApplicable');

			expect(isApplicable()).to.be.false;
		});

		it('sets Anyclip context for mini-player when ad tag available but it is not an in-content player pname (GameFAQs, ComicVine)', () => {
			context.set('services.anyclip.anyclipTagExists', true);
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);
			setup.execute();

			expect(context.get('services.anyclip.playerElementId')).to.be.null;
			expect(context.get('services.anyclip.loadWithoutAnchor')).to.be.true;
			expect(context.get('services.anyclip.loadOnPageLoad')).to.be.true;
		});

		it('sets Anyclip context for mini-player when pname a match (TV Guide)', () => {
			targetingService.set('pname', 'news');
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);
			setup.execute();

			expect(context.get('services.anyclip.playerElementId')).to.be.null;
			expect(context.get('services.anyclip.loadWithoutAnchor')).to.be.true;
			expect(context.get('services.anyclip.loadOnPageLoad')).to.be.true;
		});

		it('sets Anyclip context for in-content player when pname a match (TV Guide)', () => {
			targetingService.set('pname', 'movie');
			const setup: NewsAndRatingsAnyclipSetup = new NewsAndRatingsAnyclipSetup(
				slotsDefinitionRepository,
			);
			setup.execute();

			expect(context.get('services.anyclip.playerElementId')).not.to.be.null;
			expect(context.get('services.anyclip.loadWithoutAnchor')).to.be.false;
			expect(context.get('services.anyclip.loadOnPageLoad')).to.be.false;
		});
	});
});
