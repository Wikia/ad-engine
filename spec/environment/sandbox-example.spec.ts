import { expect } from 'chai';

// Include all modules without test files for accurate test coverage
import * as exports from '@wikia/index';
Object.entries(exports).forEach(([name, exported]) => (window[name] = exported));

describe('Sandbox Example', () => {
	it('should create test environment', () => {
		// ToDo: implement Sandbox Helper after moving with Dependency Injection task
		expect(2137).to.equal(2137);
	});
});
