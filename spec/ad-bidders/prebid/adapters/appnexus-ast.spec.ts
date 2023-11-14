import { AppnexusAst } from '@wikia/ad-bidders/prebid/adapters/appnexus-ast';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('AppnexusAst bidder adapter', () => {
	afterEach(() => {
		context.remove('slots.mobile_in_content');
	});

	before(() => {
		context.extend({
			adUnitId: '/5441/something/_{custom.pageType}/{slotConfig.adProduct}',
			custom: {
				pageType: 'PB',
			},
		});
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
				ortb2Imp: {
					ext: {
						gpid: '/5441/something/_PB/mobile_in_content',
					},
				},
				bids: [
					{
						bidder: 'appnexusAst',
						params: {
							placementId: '11223344',
							keywords: {
								pos: ['mobile_in_content'],
								src: ['gpt'],
							},
							video: {
								skippable: false,
								playback_method: ['auto_play_sound_off'],
								plcmt: 2,
							},
						},
					},
				],
			},
		]);
	});
});
