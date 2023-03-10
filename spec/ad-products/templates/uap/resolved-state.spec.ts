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
	image1: ImageParams;
	image2?: ImageParams;
}

const BIG_IMAGE = 'bigImage.png';
const DEFAULT_IMAGE = 'oldImage.png';
const RESOLVED_IMAGE = 'resolvedImage.png';

const addEventListener = (name, callback) => {
	const event = {
		target: {},
	};

	setTimeout(() => callback(event), 0);
};

const blockingUrlParams = [false, 'blocked', 'false', '0'];
const forcingUrlParams = [true, 'true', '1'];

function createCorrectParams(): Params {
	return {
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
});
