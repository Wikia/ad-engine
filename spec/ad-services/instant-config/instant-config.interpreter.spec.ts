import { InstantConfigInterpreter } from '@wikia/ad-services/instant-config/instant-config.interpreter';
import { expect } from 'chai';

describe('Instant Config Interpreter', () => {
	it('should return correct values', () => {
		const interpreter = new InstantConfigInterpreter();
		const instantConfig = {
			wgAdDriverA9BidderCountries: ['XX'],
			a9BidderCountries: [{ value: true }],
		};
		const instantGlobals = {
			wgAdDriverA9BidderCountries: ['PL'],
		};

		expect(interpreter.getValues(instantConfig, instantGlobals)).to.deep.equal({
			wgAdDriverA9BidderCountries: ['XX'],
			a9BidderCountries: {
				message: 'getValue',
				key: 'a9BidderCountries',
				groups: [{ value: true }],
			},
		});
	});
});
