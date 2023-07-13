import { Dictionary } from './dictionary';

export interface SlotPriceProvider {
	getDfpSlotPrices(slotName): Dictionary<string>;
	getCurrentSlotPrices(slotName): Promise<Dictionary<string>>;
}
