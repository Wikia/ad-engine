import { AppnexusAst } from '@wikia/ad-bidders/prebid/adapters/appnexus-ast';
import {
	PrebidPlcmtVideoSubtypes,
	PrebidVideoPlacements,
} from '@wikia/ad-bidders/prebid/prebid-models';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('AppnexusAst bidder adapter', () => {
	afterEach(() => {
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
							keywords: {
								pos: ['mobile_in_content'],
								src: ['gpt'],
							},
							video: {
								skippable: false,
								playback_method: ['auto_play_sound_off'],
								placement: PrebidVideoPlacements.IN_ARTICLE,
								plcmt: PrebidPlcmtVideoSubtypes.ACCOMPANYING_CONTENT,
							},
						},
					},
				],
			},
		]);
	});
});
