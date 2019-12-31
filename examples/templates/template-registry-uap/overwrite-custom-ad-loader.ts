import { AdSlot, Dictionary, slotService, TemplateRegistry } from '@wikia/ad-engine';

export function overwriteCustomAdLoader(registry: TemplateRegistry, methodName: string): void {
	window[methodName] = (params: Dictionary) => {
		const slot: AdSlot | null = params.slotName ? slotService.get(params.slotName) : null;

		registry.init(params.type, slot, params);
	};
}
