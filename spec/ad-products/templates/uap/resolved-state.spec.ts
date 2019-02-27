import { expect } from 'chai';
import sinon from 'sinon';
import { utils } from '../../../../src/ad-engine';
import { resolvedState } from '../../../../src/ad-products/templates/uap/resolved-state';
import { resolvedStateSwitch } from '../../../../src/ad-products/templates/uap/resolved-state-switch';

const ASPECT_RATIO = 1;
const BIG_IMAGE = 'bigImage.png';
const BIG_IMAGE_2 = 'bigImage2.png';
const DEFAULT_IMAGE = 'oldImage.png';
const RESOLVED_STATE_ASPECT_RATIO = 2;
const RESOLVED_IMAGE = 'resolvedImage.png';
const RESOLVED_IMAGE_2 = 'resolvedImage2.png';

const addEventListener = (name, callback) => {
	const event = {
		target: {},
	};

	setTimeout(() => callback(event), 0);
};

const stubs = {
	videoSettings: {
		getParams() {
			return {};
		},
		updateParams() {
			return {};
		},
		isResolvedState() {
			return false;
		},
	},
};

const blockingUrlParams = [false, 'blocked', 'false', '0'];
const forcingUrlParams = [true, 'true', '1'];

function createCorrectParams() {
	return {
		aspectRatio: ASPECT_RATIO,
		resolvedStateAspectRatio: RESOLVED_STATE_ASPECT_RATIO,
		image1: {
			element: {
				src: DEFAULT_IMAGE,
				addEventListener,
			},
			defaultStateSrc: BIG_IMAGE,
			resolvedStateSrc: RESOLVED_IMAGE,
		},
	};
}

function createIncorrectParams() {
	return {
		aspectRatio: ASPECT_RATIO,
		resolvedStateAspectRatio: 0,
		image1: {
			element: {
				src: DEFAULT_IMAGE,
				addEventListener,
			},
			defaultStateSrc: BIG_IMAGE,
			resolvedStateSrc: '',
		},
	};
}

function createCorrectParamsWithTwoAssets() {
	return {
		aspectRatio: ASPECT_RATIO,
		resolvedStateAspectRatio: RESOLVED_STATE_ASPECT_RATIO,
		image1: {
			element: {
				src: DEFAULT_IMAGE,
				addEventListener,
			},
			defaultStateSrc: BIG_IMAGE,
			resolvedStateSrc: RESOLVED_IMAGE,
		},
		image2: {
			element: {
				src: DEFAULT_IMAGE,
				addEventListener,
			},
			defaultStateSrc: BIG_IMAGE_2,
			resolvedStateSrc: RESOLVED_IMAGE_2,
		},
	};
}

describe('ResolvedState', () => {
	blockingUrlParams.forEach((param) => {
		it(`Should not be in resolved state when is not blocked by query param ${param}`, () => {
			sinon.stub(utils.queryString, 'get');
			utils.queryString.get.returns(param);

			expect(resolvedState.isResolvedState(createCorrectParams())).to.equal(false);
			utils.queryString.get.restore();
		});
	});

	forcingUrlParams.forEach((param) => {
		it(`Should be in resolved state when is forced by query param ${param}`, () => {
			sinon.stub(utils.queryString, 'get');
			utils.queryString.get.returns(param);

			expect(resolvedState.isResolvedState(createCorrectParams())).to.equal(true);
			utils.queryString.get.restore();
		});
	});

	it('Should not be in resolved state when no information about seen ad was stored', () => {
		sinon.stub(resolvedStateSwitch, 'wasDefaultStateSeen');
		resolvedStateSwitch.wasDefaultStateSeen.returns(false);

		expect(resolvedState.isResolvedState(createCorrectParams())).to.equal(false);
		resolvedStateSwitch.wasDefaultStateSeen.restore();
	});

	it('Should be in resolved state when information about seen ad was stored', () => {
		sinon.stub(resolvedStateSwitch, 'wasDefaultStateSeen');
		resolvedStateSwitch.wasDefaultStateSeen.returns(true);

		expect(resolvedState.isResolvedState(createCorrectParams())).to.equal(true);
		resolvedStateSwitch.wasDefaultStateSeen.restore();
	});

	it('Should not modify params if template does not support resolved state', () => {
		const params = createIncorrectParams();

		sinon.stub(stubs.videoSettings, 'getParams');
		stubs.videoSettings.getParams.returns(params);

		resolvedState.setImage(stubs.videoSettings);

		expect(params.aspectRatio).to.equal(ASPECT_RATIO);
		expect(params.image1.element.src).to.equal(DEFAULT_IMAGE);

		stubs.videoSettings.getParams.restore();
	});

	it('Should use default state resources when no information about seen ad was stored for add with one image', () => {
		const params = createCorrectParams();

		sinon.stub(stubs.videoSettings, 'isResolvedState');
		sinon.stub(stubs.videoSettings, 'getParams');

		stubs.videoSettings.getParams.returns(params);
		stubs.videoSettings.isResolvedState.returns(false);

		resolvedState.setImage(stubs.videoSettings);

		expect(params.aspectRatio).to.equal(ASPECT_RATIO);
		expect(params.image1.element.src).to.equal(BIG_IMAGE);

		stubs.videoSettings.getParams.restore();
		stubs.videoSettings.isResolvedState.restore();
	});

	it('Should use resolved state resources when information about seen ad was stored for add with one image', () => {
		const params = createCorrectParams();

		sinon.stub(stubs.videoSettings, 'isResolvedState');
		sinon.stub(stubs.videoSettings, 'getParams');

		stubs.videoSettings.getParams.returns(params);
		stubs.videoSettings.isResolvedState.returns(true);

		resolvedState.setImage(stubs.videoSettings);

		expect(params.aspectRatio).to.equal(RESOLVED_STATE_ASPECT_RATIO);
		expect(params.image1.element.src).to.equal(RESOLVED_IMAGE);

		stubs.videoSettings.getParams.restore();
		stubs.videoSettings.isResolvedState.restore();
	});

	it('should use default state resources when no information about seen ad was stored using split template', () => {
		const params = createCorrectParamsWithTwoAssets();

		sinon.stub(stubs.videoSettings, 'isResolvedState');
		sinon.stub(stubs.videoSettings, 'getParams');

		stubs.videoSettings.getParams.returns(params);
		stubs.videoSettings.isResolvedState.returns(false);

		resolvedState.setImage(stubs.videoSettings);

		expect(params.aspectRatio).to.equal(ASPECT_RATIO);
		expect(params.image1.element.src).to.equal(BIG_IMAGE);
		expect(params.image2.element.src).to.equal(BIG_IMAGE_2);

		stubs.videoSettings.getParams.restore();
		stubs.videoSettings.isResolvedState.restore();
	});

	it('should use resolved state resources when information about seen ad was stored using split template', () => {
		const params = createCorrectParamsWithTwoAssets();

		sinon.stub(stubs.videoSettings, 'isResolvedState');
		sinon.stub(stubs.videoSettings, 'getParams');

		stubs.videoSettings.getParams.returns(params);
		stubs.videoSettings.isResolvedState.returns(true);

		resolvedState.setImage(stubs.videoSettings);

		expect(params.aspectRatio).to.equal(RESOLVED_STATE_ASPECT_RATIO);
		expect(params.image1.element.src).to.equal(RESOLVED_IMAGE);
		expect(params.image2.element.src).to.equal(RESOLVED_IMAGE_2);

		stubs.videoSettings.getParams.restore();
		stubs.videoSettings.isResolvedState.restore();
	});

	it('should support hivi template in resolved state', () => {
		sinon.stub(resolvedStateSwitch, 'wasDefaultStateSeen');
		resolvedStateSwitch.wasDefaultStateSeen.returns(true);

		const params = {
			theme: 'hivi',
		};

		expect(resolvedState.isResolvedState(params)).to.equal(true);
		resolvedStateSwitch.wasDefaultStateSeen.restore();
	});

	it('should not support non existing template in resolved state', () => {
		sinon.stub(resolvedStateSwitch, 'wasDefaultStateSeen');
		resolvedStateSwitch.wasDefaultStateSeen.returns(true);

		const params = {
			theme: 'non-existing-template',
		};

		expect(resolvedState.isResolvedState(params)).to.equal(false);
		resolvedStateSwitch.wasDefaultStateSeen.restore();
	});
});
