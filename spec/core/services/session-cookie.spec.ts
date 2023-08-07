import { context, SessionCookie } from '@wikia/core';
import { expect } from 'chai';
import Cookies from 'js-cookie';

describe('SessionCookie', () => {
	const sessionCookie = SessionCookie.make();

	beforeEach(() => {
		sessionCookie.clear();
	});

	describe('readSessionId', () => {
		it('should read sessionId from default cookie', () => {
			// given
			global.sandbox
				.stub(Cookies, 'get')
				.withArgs('tracking_session_id')
				.returns('1111-2222-3333-4444');

			// when
			const sessionId = sessionCookie.readSessionId();

			// then
			expect(sessionId).to.equal('1111-2222-3333-4444');
		});

		it('should read sessionId from custom cookie', () => {
			// given
			global.sandbox
				.stub(context, 'get')
				.withArgs('options.session.cookieName')
				.returns('custom_session_id');
			global.sandbox
				.stub(Cookies, 'get')
				.withArgs('custom_session_id')
				.returns('1111-2222-3333-4444-custom');

			// when
			const sessionId = sessionCookie.readSessionId();

			// then
			expect(sessionId).to.equal('1111-2222-3333-4444-custom');
		});

		it('should read sessionId from context if no cookie is available', () => {
			// given
			global.sandbox
				.stub(context, 'get')
				.withArgs('options.session.id')
				.returns('1111-2222-3333-4444-context');

			// when
			const sessionId = sessionCookie.readSessionId();

			// then
			expect(sessionId).to.equal('1111-2222-3333-4444-context');
		});

		it('should use default sessionId when it is not available in context and cookie', () => {
			// given
			global.sandbox.stub(context, 'get').withArgs('options.session.id').returns(null);

			// when
			const sessionId = sessionCookie.readSessionId();

			// then
			expect(sessionId).to.equal('ae3');
		});
	});

	describe('setItem', () => {
		it('should use prefix in key', () => {
			// given
			const cookies = {
				tracking_session_id: '1111-2222-3333-4444',
			};
			global.sandbox.stub(Cookies, 'get').callsFake((key: string) => {
				return cookies[key];
			});
			const setCookieStub = global.sandbox.stub(Cookies, 'set').callsFake((key, value) => {
				cookies[key] = value;
			});
			const sessionId = sessionCookie.readSessionId();

			// when
			sessionCookie.setItem('key', 'value');

			// then
			expect(sessionCookie.getItem('key')).to.equal('value');
			expect(setCookieStub.calledOnce).to.be.true;
			expect(setCookieStub.args[0][0]).to.equal(`${sessionId}_key`);
			expect(setCookieStub.args[0][1]).to.equal('value');
		});
	});
});
