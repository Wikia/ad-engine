import sinon from 'sinon';
import { TargetingManager } from '../../../../../platforms/shared/sequential-messaging/infrastructure/targeting-manager';
import { makeContextSpy } from '../test_doubles/context.spy';

describe('Targeting manager', () => {
	it('Set Targeting', () => {
		const contextSpy = makeContextSpy();
		const sampleTargeting = { cid: 'sequential_messaging' };

		const tm = new TargetingManager(contextSpy);
		tm.setTargeting(sampleTargeting);

		sinon.assert.calledWith(contextSpy.set, 'targeting.cid', 'sequential_messaging');
	});
});
