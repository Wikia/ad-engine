import { slotService } from './slot-service';
import { templateService } from './template-service';

export function registerCustomAdLoader(methodName) {
	window[methodName] = (params) => {
		const slot = params.slotName ? slotService.get(params.slotName) : null;

		templateService.init(params.type, slot, params);
	};
}
