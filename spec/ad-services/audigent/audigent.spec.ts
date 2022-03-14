import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, utils } from '../../../src/ad-engine';
import { audigent } from '../../../src/ad-services';

describe('Audigent', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		context.set('services.audigent.enabled', true);
		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
	});

	afterEach(() => {
		sandbox.restore();
		window['au_seg'] = undefined;

		context.set('services.audigent.enabled', undefined);
		context.set('options.trackingOptIn', undefined);
		context.set('options.optOutSale', undefined);
		context.set('wiki.targeting.directedAtChildren', undefined);
		context.set('services.audigent.limit', undefined);
	});

	it('Audigent is called', async () => {
		await audigent.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Audigent can be disabled', async () => {
		context.set('services.audigent.enabled', false);

		await audigent.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Audigent not called when user is not opted in', async () => {
		context.set('options.trackingOptIn', false);

		await audigent.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Audigent not called when user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await audigent.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Audigent not called on kid wikis', async () => {
		context.set('wiki.targeting.directedAtChildren', true);

		await audigent.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Audigent key-val is set to -1 when API is too slow', async () => {
		audigent.setup();

		expect(context.get('targeting.AU_SEG')).to.equal('-1');
	});

	it('Audigent key-val is set to no_segments when no segments from API', async () => {
		window['au_seg'] = { segments: [] };

		audigent.setup();

		expect(context.get('targeting.AU_SEG')).to.equal('no_segments');
	});

	it('Audigent key-val is set to given segments when API response with some', async () => {
		const mockedSegments = ['AUG_SEG_TEST_1', 'AUG_AUD_TEST_1'];
		window['au_seg'] = { segments: mockedSegments };

		audigent.setup();

		expect(context.get('targeting.AU_SEG')).to.equal(mockedSegments);
	});

	it('Audigent key-val length keeps the limit', async () => {
		context.set('services.audigent.segmentLimit', 6);
		const mockedSegments = [
			'AUG_SEG_TEST_1',
			'AUG_SEG_TEST_2',
			'AUG_SEG_TEST_3',
			'AUG_SEG_TEST_4',
			'AUG_SEG_TEST_5',
			'AUG_AUD_TEST_1',
			'AUG_AUD_TEST_2',
			'AUG_AUD_TEST_3',
			'AUG_AUD_TEST_4',
			'AUG_AUD_TEST_5',
		];
		const expectedSegements = [
			'AUG_SEG_TEST_1',
			'AUG_SEG_TEST_2',
			'AUG_SEG_TEST_3',
			'AUG_SEG_TEST_4',
			'AUG_SEG_TEST_5',
			'AUG_AUD_TEST_1',
		];
		window['au_seg'] = { segments: mockedSegments };

		audigent.setup();

		expect(context.get('targeting.AU_SEG')).to.deep.equal(expectedSegements);
	});

	it('Audigent key-val length ignores limit if it is higher than returned segments', async () => {
		context.set('services.audigent.segmentLimit', 20);
		const mockedSegments = [
			'AUG_SEG_TEST_1',
			'AUG_SEG_TEST_2',
			'AUG_SEG_TEST_3',
			'AUG_SEG_TEST_4',
			'AUG_SEG_TEST_5',
			'AUG_AUD_TEST_1',
			'AUG_AUD_TEST_2',
			'AUG_AUD_TEST_3',
			'AUG_AUD_TEST_4',
			'AUG_AUD_TEST_5',
		];
		window['au_seg'] = { segments: mockedSegments };

		audigent.setup();

		expect(context.get('targeting.AU_SEG')).to.deep.equal(mockedSegments);
	});
});
