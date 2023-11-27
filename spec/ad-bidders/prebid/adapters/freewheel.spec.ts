import { Freewheel } from '@wikia/ad-bidders/prebid/adapters/freewheel';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('Freewheel bidder adapter', () => {
	it('can be enabled', () => {
		const freewheel = new Freewheel({
			enabled: true,
		});

		expect(freewheel.enabled).to.equal(true);
	});

	it('prepareAdUnits for mobile video returns data in correct shape', () => {
		const freewheel = new Freewheel({
			enabled: true,
			slots: {
				featured: {
					zoneId: '32563826',
				},
			},
		});
		context.set('slots.featured.isVideo', true);

		expect(freewheel.prepareAdUnits()).to.deep.equal([
			{
				code: 'featured',
				mediaTypes: {
					video: {
						playerSize: [640, 480],
					},
				},
				bids: [
					{
						bidder: 'freewheel',
						params: {
							format: 'instream',
							zoneId: '32563826',
							vastUrlParams: {
								protocolVersion: '4.2',
							},
						},
					},
				],
			},
		]);
	});

	it('prepareAdUnits for desktop video returns data in correct shape', () => {
		const freewheel = new Freewheel({
			enabled: true,
			slots: {
				featured: {
					zoneId: '32563810',
				},
			},
		});
		context.set('slots.featured.isVideo', true);

		expect(freewheel.prepareAdUnits()).to.deep.equal([
			{
				code: 'featured',
				mediaTypes: {
					video: {
						playerSize: [640, 480],
					},
				},
				bids: [
					{
						bidder: 'freewheel',
						params: {
							format: 'instream',
							zoneId: '32563810',
							vastUrlParams: {
								protocolVersion: '4.2',
							},
						},
					},
				],
			},
		]);
	});
});
