import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { Anyclip } from '@wikia/ad-services';
import { utils } from '@wikia/core';

describe('Anyclip', () => {
	const sandbox = createSandbox();

	const MOCKED_PUBNAME = 'test';
	const MOCKED_WIDGETNAME = 'test';
	const MOCKED_LIBRARY_URL = '//fandom.com/test';

	const mockIsApplicable = () => true;
	const mockIsNotApplicable = () => false;

	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox.spy(utils.scriptLoader, 'loadScript');
	});

	afterEach(() => {
		sandbox.restore();
		loadScriptStub.resetHistory();
	});

	it('loads the script when isApplicable is not a function', () => {
		const anyclip = new Anyclip(MOCKED_PUBNAME, MOCKED_WIDGETNAME, MOCKED_LIBRARY_URL, null, null);
		anyclip.loadPlayerAsset();
		expect(loadScriptStub.called).to.equal(true);
	});

	it('loads the script when isApplicable is a function and returns true', () => {
		const anyclip = new Anyclip(
			MOCKED_PUBNAME,
			MOCKED_WIDGETNAME,
			MOCKED_LIBRARY_URL,
			mockIsApplicable,
			null,
		);
		anyclip.loadPlayerAsset();
		expect(loadScriptStub.called).to.equal(true);
	});

	it('does not load the script when isApplicable is a function and returns false', () => {
		const anyclip = new Anyclip(
			MOCKED_PUBNAME,
			MOCKED_WIDGETNAME,
			MOCKED_LIBRARY_URL,
			mockIsNotApplicable,
			null,
		);
		anyclip.loadPlayerAsset();
		expect(loadScriptStub.called).to.equal(false);
	});
});
