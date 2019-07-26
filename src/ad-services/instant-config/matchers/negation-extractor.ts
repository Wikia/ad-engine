import { negativePrefix } from '../instant-config.models';

export interface NegationObject {
	value: string;
	negated: boolean;
}

export function extractNegation(input: string): NegationObject {
	return input.startsWith(negativePrefix)
		? { value: input.replace(negativePrefix, ''), negated: true }
		: { value: input, negated: false };
}
