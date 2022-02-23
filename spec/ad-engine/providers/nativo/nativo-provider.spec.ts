import { expect } from 'chai';
import { adSlotFake } from '../../ad-slot-fake';
import { NativoProvider } from '../../../../src/ad-engine/providers/nativo/nativo-provider';
import { spy } from 'sinon';

describe('Nativo Provider', () => {
	beforeEach(() => {
		window.ntv = {
			cmd: ['mocked-element'],
			Events: {
				PubSub: {
					subscribe: spy(),
				},
			},
		} as NativoSdk;
	});

	it('initialise and setup Nativo queue', () => {
		const nativo = new NativoProvider(window.ntv);
		expect(nativo.getQueue()).to.equal(window.ntv.cmd);
	});

	it('filling slot subscribes to events and pushes SDK call to Nativo queue', () => {
		const nativo = new NativoProvider(window.ntv);
		nativo.fillIn(adSlotFake as any);
		expect(nativo.getQueue().length).to.equal(2);
		expect(window.ntv.Events.PubSub.subscribe.callCount).to.equal(2);
	});
});
