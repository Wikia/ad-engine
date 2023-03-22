import { context } from '../services';

interface AgeGateResult {
	dialogShown: boolean;
	adult?: boolean;
	timestamp: number;
}

export function isCoppaSubject(): boolean {
	try {
		const ageGateResult = localStorage.getItem('age_gate');
		if (ageGateResult) {
			const parsedAgeGateResult = JSON.parse(ageGateResult) as AgeGateResult;
			return parsedAgeGateResult?.dialogShown
				? !parsedAgeGateResult.adult
				: context.get('wiki.targeting.directedAtChildren');
		}
	} catch (e) {
		return context.get('wiki.targeting.directedAtChildren');
	}
}
