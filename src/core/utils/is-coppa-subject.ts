import { context } from '../services';

interface AgeGateResult {
	dialogShown: boolean;
	adult: boolean;
	timestamp: number;
}

export function isCoppaSubject(): boolean {
	try {
		const localStorageValue = localStorage.getItem('age_gate');
		const ageGateResult = JSON.parse(localStorageValue) as AgeGateResult;
		console.log('AgeGateResult: ', ageGateResult);
		return ageGateResult?.dialogShown
			? !ageGateResult.adult
			: context.get('wiki.targeting.directedAtChildren');
	} catch (e) {
		return context.get('wiki.targeting.directedAtChildren');
	}
}
