import { context } from '../services';

interface AgeGateResult {
	dialogShown: boolean;
	adult: boolean;
	timestamp: number;
}

export function isCoppaSubject(): boolean {
	try {
		const ageGateResult = JSON.parse(localStorage.getItem('age_gate')) as AgeGateResult;
		return ageGateResult?.dialogShown
			? !ageGateResult.adult
			: context.get('wiki.targeting.directedAtChildren');
	} catch (e) {
		return context.get('wiki.targeting.directedAtChildren');
	}
}
