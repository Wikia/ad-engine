// @ts-strict-ignore
import { GlobalContextCategories, globalContextService } from '../services/global-context-service';

export function isCoppaSubject(): boolean {
	return globalContextService.getValue(GlobalContextCategories.partners, 'directedAtChildren');
}
