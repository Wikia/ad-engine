import { extractNegation } from '@wikia/ad-services/instant-config/matchers/negation-extractor';
import { expect } from 'chai';

describe('Negation Extractor', () => {
	it('should extract negated object', () => {
		const result = extractNegation('non-PL');

		expect(result).to.deep.equal({ value: 'PL', negated: true });
	});

	it('should extract not negated object', () => {
		const result = extractNegation('PL');

		expect(result).to.deep.equal({ value: 'PL', negated: false });
	});
});
