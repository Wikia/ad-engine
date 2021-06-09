import { AppnexusAst } from '@wikia/ad-bidders/prebid/adapters/appnexus-ast';
import { context } from '@wikia/ad-engine';
import { expect } from 'chai';

describe('AppnexusAst bidder adapter', () => {
	afterEach(() => {
		context.set('bidders.prebid.additionalKeyvals.appnexus', false);
		context.remove('slots.mobile_in_content');
	});

	it('can be enabled', () => {
		const appnexusAst = new AppnexusAst({
			enabled: true,
		});

		expect(appnexusAst.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const appnexusAst = new AppnexusAst({
			enabled: true,
			slots: {
				mobile_in_content: {
					placementId: '11223344',
				},
			},
		});

		expect(appnexusAst.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					video: {
						context: 'instream',
						playerSize: [640, 480],
					},
				},
				bids: [
					{
						bidder: 'appnexusAst',
						params: {
							placementId: '11223344',
							keywords: {},
							video: {
								skippable: false,
								playback_method: ['auto_play_sound_off'],
							},
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits returns data in correct shape with additional key-vals', () => {
		context.set('bidders.prebid.additionalKeyvals.appnexus', true);

		const appnexusAst = new AppnexusAst({
			enabled: true,
			slots: {
				mobile_in_content: {
					placementId: '11223344',
				},
			},
		});

		expect(appnexusAst.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					video: {
						context: 'instream',
						playerSize: [640, 480],
					},
				},
				bids: [
					{
						bidder: 'appnexusAst',
						params: {
							placementId: '11223344',
							keywords: {
								p_standard: [],
								src: ['gpt'],
								pos: ['mobile_in_content'],
							},
							video: {
								skippable: false,
								playback_method: ['auto_play_sound_off'],
							},
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits returns data in correct shape with additional key-vals and RealVu flag', () => {
		context.set('bidders.prebid.additionalKeyvals.appnexus', true);
		context.set('slots.mobile_in_content.targeting.realvu', ['yes']);

		const appnexusAst = new AppnexusAst({
			enabled: true,
			slots: {
				mobile_in_content: {
					placementId: '11223344',
				},
			},
		});

		expect(appnexusAst.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaTypes: {
					video: {
						context: 'instream',
						playerSize: [640, 480],
					},
				},
				bids: [
					{
						bidder: 'appnexusAst',
						params: {
							placementId: '11223344',
							keywords: {
								p_standard: [],
								realvu: ['yes'],
								src: ['gpt'],
								pos: ['mobile_in_content'],
							},
							video: {
								skippable: false,
								playback_method: ['auto_play_sound_off'],
							},
						},
					},
				],
			},
		]);
	});
});
