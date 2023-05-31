import { GlobalContextCategories, globalContextService } from '../index';

export function isCoppaSubject(): boolean {
	return globalContextService.getValue(GlobalContextCategories.partners, 'directedAtChildren');
}
