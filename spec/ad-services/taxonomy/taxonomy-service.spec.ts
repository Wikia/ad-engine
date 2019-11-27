import { expect } from 'chai';
import * as sinon from 'sinon';
import { context } from '../../../src/ad-engine';
import { taxonomyService } from '../../../src/ad-services/taxonomy/taxonomy-service';
import {
	AdTags,
	taxonomyServiceLoader,
} from '../../../src/ad-services/taxonomy/taxonomy-service.loader';

describe('Taxonomy service', () => {
	const sandbox = sinon.createSandbox();
	let getAdTagsStub;

	const adTags: AdTags = {
		esrb: ['foo', 'bar'],
	};

	beforeEach(() => {
		context.set('services.taxonomy.enabled', true);
		getAdTagsStub = sandbox.stub(taxonomyServiceLoader, 'getAdTags').callsFake(() => {
			return Promise.resolve(adTags);
		});
	});

	afterEach(() => {
		context.remove('services.taxonomy.enabled');
		sandbox.restore();
	});

	it('configures fetched ad tags in context targeting', async () => {
		const fetchedAdTags = await taxonomyService.configurePageLevelTargeting();

		expect(getAdTagsStub.called).to.be.true;

		expect(fetchedAdTags).to.deep.equal({
			esrb: ['foo', 'bar'],
		});
		expect(context.get('targeting.txn')).to.equal('1');
		expect(context.get('targeting.esrb')).to.deep.equal(['foo', 'bar']);
	});

	it('does not fetch ad tags when service is disabled', async () => {
		context.set('services.taxonomy.enabled', false);

		const fetchedAdTags = await taxonomyService.configurePageLevelTargeting();

		expect(getAdTagsStub.called).to.be.false;
		expect(fetchedAdTags).to.deep.equal({});
	});

	it('fetched ad tags resolves delay promise', async () => {
		let delayResolved = false;
		taxonomyService.getPromise().then(() => {
			delayResolved = true;
		});

		await taxonomyService.configurePageLevelTargeting();

		expect(delayResolved).to.be.true;
	});

	it('is named delay module', async () => {
		expect(taxonomyService.getName()).to.equal('taxonomy-service');
	});
});

describe('Taxonomy service - comics tag', () => {
	const sandbox = sinon.createSandbox();
	let getComicsTagStub;

	const comicsTag = '[1]';

	beforeEach(() => {
		context.set('services.taxonomy.comics.enabled', true);
		getComicsTagStub = sandbox.stub(taxonomyServiceLoader, 'getComicsTag').callsFake(() => {
			return Promise.resolve(comicsTag);
		});
	});

	afterEach(() => {
		context.remove('services.taxonomy.comics.enabled');
		sandbox.restore();
	});

	it('configures fetched comics tag in context targeting', async () => {
		const fetchedComicsTag = await taxonomyService.configureComicsTargeting();

		expect(getComicsTagStub.called).to.be.true;
		expect(fetchedComicsTag).to.deep.equal({
			txn_comics: ['[1]'],
		});
		expect(context.get('targeting.txn_comics')).to.deep.equal(['[1]']);
	});

	it('does not fetch comics tag when service is disabled', async () => {
		context.set('services.taxonomy.comics.enabled', false);

		const fetchedComicsTag = await taxonomyService.configureComicsTargeting();

		expect(getComicsTagStub.called).to.be.false;
		expect(fetchedComicsTag).to.be.an('object').that.is.empty;
	});

	it('fetched comics tag resolves delay promise', async () => {
		let delayResolved = false;
		taxonomyService.getPromise().then(() => {
			delayResolved = true;
		});

		await taxonomyService.configureComicsTargeting();

		expect(delayResolved).to.be.true;
	});

	it('is named delay module', async () => {
		expect(taxonomyService.getName()).to.equal('taxonomy-service');
	});
});
