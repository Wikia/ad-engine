import { Rubicon } from '@wikia/ad-bidders/prebid/adapters/rubicon';
import { context } from '@wikia/ad-engine/services/context-service';
import { expect } from 'chai';

describe('Rubicon bidder adapter', () => {
	it('can be enabled', () => {
		const rubicon = new Rubicon({
			enabled: true,
		});

		expect(rubicon.enabled).to.equal(true);
	});

	it('prepareAdUnits returns data in correct shape', () => {
		const rubicon = new Rubicon({
			enabled: true,
			accountId: 1234,
			slots: {
				mobile_in_content: {
					siteId: '55111',
					sizeId: '101',
					zoneId: '88888',
					position: 'btf',
				},
			},
		});

		context.set('bidders.prebid.targeting', {
			foo: 1,
			bar: 'test',
		});

		expect(rubicon.prepareAdUnits()).to.deep.equal([
			{
				code: 'mobile_in_content',
				mediaType: 'video',
				mediaTypes: {
					video: {
						playerSize: [640, 480],
						context: 'instream',
						api: [2],
						linearity: 1,
						mimes: ['video/mp4', 'video/x-flv', 'video/webm', 'video/ogg'],
						maxduration: 30,
						protocols: [2, 3, 5, 6],
					},
				},
				bids: [
					{
						bidder: 'rubicon',
						params: {
							accountId: 1234,
							siteId: '55111',
							zoneId: '88888',
							name: 'mobile_in_content',
							position: 'btf',
							inventory: {
								bar: 'test',
								foo: 1,
								pos: ['mobile_in_content'],
							},
							video: {
								playerWidth: '640',
								playerHeight: '480',
								size_id: '101',
								language: 'en',
							},
						},
					},
				],
			},
		]);
	});
});
