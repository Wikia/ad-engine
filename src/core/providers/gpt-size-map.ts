import { Dictionary } from '../models';
import { logger } from '../utils';

const logGroup = 'gpt-size-map';

export interface GptSizeMapping {
	viewportSize: googletag.SingleSizeArray;
	sizes: googletag.GeneralSize;
}

export class GptSizeMap {
	constructor(private readonly sizeMap: GptSizeMapping[] = []) {
		logger(logGroup, this.sizeMap, 'creating new size map');
	}

	addSize(viewportSize: googletag.SingleSizeArray, sizes: googletag.GeneralSize): void {
		logger(logGroup, viewportSize, sizes, 'adding new size mapping');
		this.sizeMap.push({
			viewportSize,
			sizes,
		});
	}

	build(): googletag.SizeMappingArray | null {
		logger(logGroup, this.sizeMap, 'creating GPT size mapping builder');
		const builder: googletag.SizeMappingBuilder | undefined =
			window.googletag && window.googletag.sizeMapping();

		if (!builder) {
			logger(logGroup, 'cannot create GPT size mapping builder');

			return null;
		}

		this.sizeMap.forEach(({ viewportSize, sizes }) => {
			builder.addSize(viewportSize, sizes);
		});

		return builder.build();
	}

	isEmpty(): boolean {
		return !this.sizeMap.length;
	}

	mapAllSizes(
		callback: (
			sizes: googletag.GeneralSize,
			viewportSize: googletag.SingleSizeArray,
			index: number,
		) => googletag.GeneralSize,
	): GptSizeMap {
		return new GptSizeMap(
			this.sizeMap.map(({ viewportSize, sizes }, index) => {
				const mappedSizes: googletag.GeneralSize = callback(sizes, viewportSize, index);

				logger(logGroup, viewportSize, sizes, mappedSizes, 'mapping viewport sizes');

				return {
					viewportSize,
					sizes: mappedSizes,
				};
			}),
		);
	}

	toString(): string {
		logger(logGroup, this.sizeMap, 'casting to string');
		const map: Dictionary<googletag.GeneralSize> = {};

		this.sizeMap.forEach(({ viewportSize, sizes }) => {
			map[viewportSize.join('x')] = sizes;
		});

		return JSON.stringify(map);
	}
}
