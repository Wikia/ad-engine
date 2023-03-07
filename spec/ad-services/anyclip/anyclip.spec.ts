import { Anyclip } from '@wikia/ad-services';
import { utils } from '@wikia/core';
import { WaitFor } from '@wikia/core/utils';
import { expect } from 'chai';

describe('Anyclip', () => {
	const MOCKED_PUBNAME = 'test';
	const MOCKED_WIDGETNAME = 'test';
	const MOCKED_LIBRARY_URL = '//fandom.com/test';

	const mockIsApplicable = () => true;
	const mockIsNotApplicable = () => false;

	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = global.sandbox.spy(utils.scriptLoader, 'loadScript');
		global.sandbox.stub(WaitFor.prototype, 'until').returns(Promise.resolve());
	});

	afterEach(() => {
		loadScriptStub.resetHistory();
		global.sandbox.restore();
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
