import { AdSlot, Dictionary } from '../models';
import { logger } from '../utils';

const logGroup = 'filler-service';
export interface SlotFiller {
	fill: (adSlot: AdSlot) => void;
	getContainer: () => HTMLElement;
	getName: () => string;
}

class FillerService {
	fillers: Dictionary<SlotFiller> = {};

	apply(adSlot: AdSlot, fillerName: string): void {
		this.get(fillerName).fill(adSlot);
	}

	get(fillerName: string): SlotFiller {
		const result = this.fillers[fillerName];
		if (!result) {
			logger(logGroup, result, `${fillerName} - filler is not registered`);
		}
		return result;
	}

	register(filler: SlotFiller): void {
		const fillerName = filler.getName();

		this.fillers[fillerName] = filler;
	}
}
export const fillerService = new FillerService();
