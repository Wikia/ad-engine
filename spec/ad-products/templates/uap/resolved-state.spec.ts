import { resolvedState } from '@wikia/ad-products';
import { resolvedStateSwitch } from '@wikia/ad-products/templates/uap/resolved-state-switch';
import { utils } from '@wikia/core';
import { expect } from 'chai';

interface ImageParams {
	element: {
		addEventListener: (name: string, callback: () => void) => void;
		src: string;
	};
	defaultStateSrc?: string;
	resolvedStateSrc?: string;
}

interface Params {
	aspectRatio: number;
	resolvedStateAspectRatio: number;
	image1: ImageParams;
	image2?: ImageParams;
}

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
		getParams(): Params {
			return {
				aspectRatio: 123,
				resolvedStateAspectRatio: 456,
				image1: {
					element: {
						addEventListener: () => {},
						src: 'test/image.jpg',
					},
				},
			};
		},
		isResolvedState(): boolean {
			return false;
		},
	},
};

const blockingUrlParams = [false, 'blocked', 'false', '0'];
const forcingUrlParams = [true, 'true', '1'];

function createCorrectParams(): Params {
	return {
		aspectRatio: ASPECT_RATIO,
		resolvedStateAspectRatio: RESOLVED_STATE_ASPECT_RATIO,
		image1: {
			element: {
				addEventListener,
				src: DEFAULT_IMAGE,
			},
			defaultStateSrc: BIG_IMAGE,
			resolvedStateSrc: RESOLVED_IMAGE,
		},
	};
}

function createIncorrectParams(): Params {
	return {
		aspectRatio: ASPECT_RATIO,
		resolvedStateAspectRatio: 0,
		image1: {
			element: {
				addEventListener,
				src: DEFAULT_IMAGE,
			},
			defaultStateSrc: BIG_IMAGE,
			resolvedStateSrc: '',
		},
	};
}

function createCorrectParamsWithTwoAssets(): Params {
	return {
		aspectRatio: ASPECT_RATIO,
		resolvedStateAspectRatio: RESOLVED_STATE_ASPECT_RATIO,
		image1: {
			element: {
				addEventListener,
				src: DEFAULT_IMAGE,
			},
			defaultStateSrc: BIG_IMAGE,
			resolvedStateSrc: RESOLVED_IMAGE,
		},
		image2: {
			element: {
				addEventListener,
				src: DEFAULT_IMAGE,
			},
			defaultStateSrc: BIG_IMAGE_2,
			resolvedStateSrc: RESOLVED_IMAGE_2,
		},
	};
}

describe('ResolvedState', () => {
	blockingUrlParams.forEach((param) => {
		it(`Should not be in resolved state when is not blocked by query param ${param}`, () => {
			global.sandbox.stub(utils.queryString, 'get').returns(param as any);

			expect(resolvedState.isResolvedState(createCorrectParams())).to.equal(false);
		});
	});

	forcingUrlParams.forEach((param) => {
		it(`Should be in resolved state when is forced by query param ${param}`, () => {
			global.sandbox.stub(utils.queryString, 'get').returns(param as any);

			expect(resolvedState.isResolvedState(createCorrectParams())).to.equal(true);
		});
	});

	it('Should not be in resolved state when no information about seen ad was stored', () => {
		global.sandbox.stub(resolvedStateSwitch, 'wasDefaultStateSeen').returns(false);

		expect(resolvedState.isResolvedState(createCorrectParams())).to.equal(false);
	});

	it('Should be in resolved state when information about seen ad was stored', () => {
		global.sandbox.stub(resolvedStateSwitch, 'wasDefaultStateSeen').returns(true);

		expect(resolvedState.isResolvedState(createCorrectParams())).to.equal(true);
	});

	it('Should not modify params if template does not support resolved state', () => {
		const params = createIncorrectParams();

		global.sandbox.stub(stubs.videoSettings, 'getParams').returns(params);

		resolvedState.setImage(stubs.videoSettings);

		expect(params.aspectRatio).to.equal(ASPECT_RATIO);
		expect(params.image1.element.src).to.equal(DEFAULT_IMAGE);
	});

	it('Should use default state resources when no information about seen ad was stored for add with one image', () => {
		const params = createCorrectParams();

		global.sandbox.stub(stubs.videoSettings, 'isResolvedState').returns(false);
		global.sandbox.stub(stubs.videoSettings, 'getParams').returns(params);

		resolvedState.setImage(stubs.videoSettings);

		expect(params.aspectRatio).to.equal(ASPECT_RATIO);
		expect(params.image1.element.src).to.equal(BIG_IMAGE);
	});

	it('Should use resolved state resources when information about seen ad was stored for add with one image', () => {
		const params = createCorrectParams();

		global.sandbox.stub(stubs.videoSettings, 'isResolvedState').returns(true);
		global.sandbox.stub(stubs.videoSettings, 'getParams').returns(params);

		resolvedState.setImage(stubs.videoSettings);

		expect(params.aspectRatio).to.equal(RESOLVED_STATE_ASPECT_RATIO);
		expect(params.image1.element.src).to.equal(RESOLVED_IMAGE);
	});

	it('should use default state resources when no information about seen ad was stored using split template', () => {
		const params = createCorrectParamsWithTwoAssets();

		global.sandbox.stub(stubs.videoSettings, 'isResolvedState').returns(false);
		global.sandbox.stub(stubs.videoSettings, 'getParams').returns(params);

		resolvedState.setImage(stubs.videoSettings);

		expect(params.aspectRatio).to.equal(ASPECT_RATIO);
		expect(params.image1.element.src).to.equal(BIG_IMAGE);
		expect(params.image2.element.src).to.equal(BIG_IMAGE_2);
	});

	it('should use resolved state resources when information about seen ad was stored using split template', () => {
		const params = createCorrectParamsWithTwoAssets();

		global.sandbox.stub(stubs.videoSettings, 'isResolvedState').returns(true);
		global.sandbox.stub(stubs.videoSettings, 'getParams').returns(params);

		resolvedState.setImage(stubs.videoSettings);

		expect(params.aspectRatio).to.equal(RESOLVED_STATE_ASPECT_RATIO);
		expect(params.image1.element.src).to.equal(RESOLVED_IMAGE);
		expect(params.image2.element.src).to.equal(RESOLVED_IMAGE_2);
	});

	it('should support hivi template in resolved state', () => {
		global.sandbox.stub(resolvedStateSwitch, 'wasDefaultStateSeen').returns(true);

		const params = {
			theme: 'hivi',
		};

		expect(resolvedState.isResolvedState(params)).to.equal(true);
	});

	it('should not support non existing template in resolved state', () => {
		global.sandbox.stub(resolvedStateSwitch, 'wasDefaultStateSeen').returns(true);

		const params = {
			theme: 'non-existing-template',
		};

		expect(resolvedState.isResolvedState(params)).to.equal(false);
	});
});
