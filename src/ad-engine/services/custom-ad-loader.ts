import { AdSlot, Dictionary } from '../models';
import { slotService } from './slot-service';
import { templateService } from './template-service';

export function registerCustomAdLoader(methodName: string): void {
	// @ts-ignore
	window[methodName] = (params: Dictionary) => {
		const slot: AdSlot | null = params.slotName ? slotService.get(params.slotName) : null;

		templateService.init(params.type, slot, params);
	};
}
