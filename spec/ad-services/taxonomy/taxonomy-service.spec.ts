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

	it('is named delay module', async () => {
		expect(taxonomyService.getName()).to.equal('taxonomy-service');
	});
});
