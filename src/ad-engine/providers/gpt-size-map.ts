import { logger } from '../utils';

const logGroup = 'gpt-size-map';

export class GptSizeMap {
	constructor(sizeMap) {
		this.sizeMap = sizeMap || [];
		logger(logGroup, this.sizeMap, 'creating new size map');
	}

	addSize(viewportSize, sizes) {
		logger(logGroup, viewportSize, sizes, 'adding new size mapping');
		this.sizeMap.push({
			viewportSize,
			sizes,
		});
	}

	build() {
		logger(logGroup, this.sizeMap, 'creating GPT size mapping builder');
		const builder = window.googletag && window.googletag.sizeMapping();

		if (!builder) {
			logger(logGroup, 'cannot create GPT size mapping builder');

			return null;
		}

		this.sizeMap.forEach(({ viewportSize, sizes }) => {
			builder.addSize(viewportSize, sizes);
		});

		return builder.build();
	}

	isEmpty() {
		return !this.sizeMap.length;
	}

	mapAllSizes(callback) {
		return new GptSizeMap(
			this.sizeMap.map(({ viewportSize, sizes }, index) => {
				const mappedSizes = callback(sizes, viewportSize, index);

				logger(logGroup, viewportSize, sizes, mappedSizes, 'mapping viewport sizes');

				return {
					viewportSize,
					sizes: mappedSizes,
				};
			}),
		);
	}

	toString() {
		logger(logGroup, this.sizeMap, 'casting to string');
		const map = {};

		this.sizeMap.forEach(({ viewportSize, sizes }) => {
			map[viewportSize.join('x')] = sizes;
		});

		return JSON.stringify(map);
	}
}
