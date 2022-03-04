import { expect } from 'chai';
import { adSlotFake } from '../../ad-slot-fake';
import { NativoProvider } from '../../../../src/ad-engine/providers/nativo/nativo-provider';

describe('Nativo Provider', () => {
	const originalWindowNtv = window.ntv;

	beforeEach(() => {
		window.ntv = {
			cmd: ['mocked-element'],
		} as NativoApi;
	});

	afterEach(() => {
		window.ntv = originalWindowNtv;
	});

	it('initialise and setup Nativo queue', () => {
		const nativo = new NativoProvider(window.ntv);
		expect(nativo.getQueue()).to.equal(window.ntv.cmd);
	});

	it('filling slot pushes SDK call to Nativo command queue', () => {
		const nativo = new NativoProvider(window.ntv);
		nativo.fillIn(adSlotFake as any);
		expect(nativo.getQueue().length).to.equal(2);
	});
});
