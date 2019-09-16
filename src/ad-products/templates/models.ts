import { AdSlot } from '@ad-engine/core';

export interface TemplatesConfig {
	onInit: (adSlot: AdSlot) => void;
}
