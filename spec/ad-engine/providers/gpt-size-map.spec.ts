import { expect } from 'chai';
import { GptSizeMap } from '../../../src/ad-engine/providers/gpt-size-map';

describe('gpt-size-map', () => {
	it('provides information about emptiness', () => {
		const sizes = [{ viewportSize: [728, 0], sizes: [[728, 90]] }];

		expect(new GptSizeMap(sizes).isEmpty()).to.be.false;
		expect(new GptSizeMap([]).isEmpty()).to.be.true;
	});

	it('casts correct size values to string', () => {
		const sizes = [{ viewportSize: [728, 0], sizes: [[728, 90]] }];

		expect(new GptSizeMap(sizes).toString()).to.equal('{"728x0":[[728,90]]}');
	});

	it('casts multiple size values to string', () => {
		const sizes = [{ viewportSize: [728, 0], sizes: [[728, 90], [300, 250]] }];

		expect(new GptSizeMap(sizes).toString()).to.equal('{"728x0":[[728,90],[300,250]]}');
	});

	it('casts multiple size values in different viewports to string', () => {
		const sizes = [
			{ viewportSize: [728, 0], sizes: [[728, 90], [300, 250]] },
			{ viewportSize: [768, 0], sizes: [[300, 250], [300, 600]] },
		];

		expect(new GptSizeMap(sizes).toString()).to.equal(
			'{"728x0":[[728,90],[300,250]],"768x0":[[300,250],[300,600]]}',
		);
	});

	it('adds new viewport size mappings to the collection', () => {
		const sizeMap = new GptSizeMap();

		sizeMap.addSize([728, 0], [[728, 90]]);

		expect(sizeMap.sizeMap).to.deep.equal([{ viewportSize: [728, 0], sizes: [[728, 90]] }]);
	});

	it('has ability to map all sizes', () => {
		const initSizes = [
			{ viewportSize: [728, 0], sizes: [[728, 90], [300, 250]] },
			{ viewportSize: [768, 0], sizes: [[300, 250], [300, 600]] },
		];
		const mapSizes = [
			{ viewportSize: [728, 0], sizes: [[0, 0]] },
			{ viewportSize: [768, 0], sizes: [[1, 1]] },
		];
		const sizeMap = new GptSizeMap(initSizes);

		expect(
			sizeMap.mapAllSizes((sizes, viewportSize, index) => {
				expect(sizes).to.deep.equal(initSizes[index].sizes);
				expect(viewportSize).to.deep.equal(initSizes[index].viewportSize);

				return [[index, index]];
			}).sizeMap,
		).to.deep.equal(mapSizes);
	});
});
