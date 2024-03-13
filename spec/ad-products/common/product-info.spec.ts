import { getAdProductInfo, getAdUnitString } from '@wikia/ad-products';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('product-info', () => {
	it('should return ad product info', () => {
		expect(getAdProductInfo('incontent_player')).to.deep.equal({
			adGroup: 'OTHER',
			adProduct: 'incontent_player',
		});
	});

	it('should return ad product info from slotGroups', () => {
		global.sandbox
			.stub(context, 'get')
			.withArgs('slotGroups')
			.returns({
				VIDEO: ['FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
			});

		expect(getAdProductInfo('video')).to.deep.equal({
			adGroup: 'VIDEO',
			adProduct: 'video',
		});
	});

	it('should return ad unit string #1', () => {
		global.sandbox
			.stub(context, 'get')
			.withArgs('slots.incontent_player.videoAdUnit')
			.returns('/5441/something/{slotConfig.adProduct}');

		expect(getAdUnitString('incontent_player', { adProduct: 'video' })).to.equal(
			'/5441/something/video',
		);
	});

	it('should return ad unit string #2', () => {
		global.sandbox
			.stub(context, 'get')
			.withArgs('vast.adUnitId')
			.returns('/5441/something/{slotConfig.adProduct}');

		expect(getAdUnitString('incontent_player', { adProduct: 'video' })).to.equal(
			'/5441/something/video',
		);
	});
});
