import { InstantConfigService } from '@wikia/ad-services';
import sinon from 'sinon';
import { expect } from 'chai';
import { OutstreamExperiment } from '../../../../src/platforms/shared';

const excoVariant = 'exco';
const anyclipVariant = 'anyclip';
const connatixVariant = 'connatix';
const defaultVariant = 'distroscale';

describe('outstream experiment', () => {
	it('is disabled', () => {
		const instantConfigStub = stubInstantConfig(false, excoVariant);

		const outstreamExperiment = new OutstreamExperiment(instantConfigStub);

		expect(outstreamExperiment.enabled).to.be.false;
		expect(outstreamExperiment.isExco()).to.be.false;
		expect(outstreamExperiment.isConnatix()).to.be.false;
		expect(outstreamExperiment.isAnyclip()).to.be.false;
	});

	it('is enabled and exco variant is chosen', () => {
		const instantConfigStub = stubInstantConfig(true, excoVariant);

		const outstreamExperiment = new OutstreamExperiment(instantConfigStub);

		expect(outstreamExperiment.enabled).to.be.true;
		expect(outstreamExperiment.isExco()).to.be.true;
		expect(outstreamExperiment.isConnatix()).to.be.false;
		expect(outstreamExperiment.isAnyclip()).to.be.false;
	});

	it('is enabled and connatix variant is chosen', () => {
		const instantConfigStub = stubInstantConfig(true, connatixVariant);

		const outstreamExperiment = new OutstreamExperiment(instantConfigStub);

		expect(outstreamExperiment.enabled).to.be.true;
		expect(outstreamExperiment.isExco()).to.be.false;
		expect(outstreamExperiment.isConnatix()).to.be.true;
		expect(outstreamExperiment.isAnyclip()).to.be.false;
	});

	it('is enabled and anyclip variant is chosen', () => {
		const instantConfigStub = stubInstantConfig(true, anyclipVariant);

		const outstreamExperiment = new OutstreamExperiment(instantConfigStub);

		expect(outstreamExperiment.enabled).to.be.true;
		expect(outstreamExperiment.isExco()).to.be.false;
		expect(outstreamExperiment.isConnatix()).to.be.false;
		expect(outstreamExperiment.isAnyclip()).to.be.true;
	});

	it('is enabled and default variant is chosen', () => {
		const instantConfigStub = stubInstantConfig(true, defaultVariant);

		const outstreamExperiment = new OutstreamExperiment(instantConfigStub);

		expect(outstreamExperiment.enabled).to.be.true;
		expect(outstreamExperiment.isExco()).to.be.false;
		expect(outstreamExperiment.isConnatix()).to.be.false;
		expect(outstreamExperiment.isAnyclip()).to.be.false;
	});

	function stubInstantConfig(enabled: boolean, variant: string) {
		const instantConfigStub = sinon.createStubInstance(InstantConfigService);
		instantConfigStub.get.onFirstCall().returns(enabled);
		instantConfigStub.get.onSecondCall().returns(variant);
		return instantConfigStub;
	}
});
