import { MultivariantExperiment } from '@wikia/platforms/shared';
import { InstantConfigService, InstantConfigServiceInterface } from '@wikia/ad-services';
import sinon from 'sinon';
import { expect } from 'chai';

const firstVariant = 'variant1';
const defaultVariant = 'defaultVariant';

describe('multi variant experiment', () => {
	it('is disabled', () => {
		const multiVariantExperiment = prepareExperiment(false, firstVariant);

		expect(multiVariantExperiment.enabled).to.be.false;
		expect(multiVariantExperiment.isVariantSelected(defaultVariant)).to.be.false;
		expect(multiVariantExperiment.isVariantSelected(firstVariant)).to.be.false;
	});

	it('is enabled and first variant is chosen', () => {
		const multiVariantExperiment = prepareExperiment(true, firstVariant);

		expect(multiVariantExperiment.enabled).to.be.true;
		expect(multiVariantExperiment.isVariantSelected(defaultVariant)).to.be.false;
		expect(multiVariantExperiment.isVariantSelected(firstVariant)).to.be.true;
	});

	it('is enabled and default variant is chosen', () => {
		const multiVariantExperiment = prepareExperiment(true, defaultVariant);

		expect(multiVariantExperiment.enabled).to.be.true;
		expect(multiVariantExperiment.isVariantSelected(defaultVariant)).to.be.true;
		expect(multiVariantExperiment.isVariantSelected('variant1')).to.be.false;
	});

	function prepareExperiment(enabled: boolean, variant: string) {
		const instantConfigStub = sinon.createStubInstance(InstantConfigService);
		instantConfigStub.get.onFirstCall().returns(enabled);
		instantConfigStub.get.onSecondCall().returns(variant);

		return new MultiVariantExperimentToTest(
			instantConfigStub,
			'experimentEnabled',
			'experimentVariant',
			defaultVariant,
		);
	}
});

class MultiVariantExperimentToTest extends MultivariantExperiment {
	constructor(
		instantConfig: InstantConfigServiceInterface,
		enabledVariableName: string,
		variantVariableName: string,
		defaultVariant: string,
	) {
		super(instantConfig, enabledVariableName, variantVariableName, defaultVariant);
	}
}
