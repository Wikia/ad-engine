import { jwpEvents } from '@wikia/ad-products/video/jwplayer/streams/jwplayer-events';
import { ofJwpEvent } from '@wikia/ad-products/video/jwplayer/streams/jwplayer-stream';
import { createJwpStatelessStream } from '@wikia/ad-products/video/jwplayer/streams/jwplayer-stream-stateless';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { createJwplayerStub, JwplayerStub } from '../jwplayer.stub';

describe('Jwplayer Stream Stateless', () => {
	const sandbox = createSandbox();
	let jwplayerStub: JwplayerStub;

	beforeEach(() => {
		jwplayerStub = createJwplayerStub(sandbox);
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('all events', () => {
		let callbacks = [];

		beforeEach(() => {
			callbacks = [];
			jwplayerStub.on.callsFake((name: string, cb) => callbacks.push(cb));
		});

		it('should emit every event once', () => {
			jwplayerStub.getConfig.returns({ itemReady: true });

			const emittedEvents = [];
			createJwpStatelessStream(jwplayerStub).subscribe(({ name }) => emittedEvents.push(name));

			callbacks.forEach((cb) => cb());
			expect(emittedEvents.sort()).to.deep.equal([...jwpEvents].sort());
		});

		it('should not emit lateReady', () => {
			jwplayerStub.getConfig.returns({ itemReady: false });

			const emittedEvents = [];
			createJwpStatelessStream(jwplayerStub).subscribe(({ name }) => emittedEvents.push(name));

			callbacks.forEach((cb) => cb());
			expect(emittedEvents.sort()).to.deep.equal(
				jwpEvents.filter((name) => name !== 'lateReady').sort(),
			);
		});
	});

	describe('adError - ensureEventTag', () => {
		it('should contain empty tag', () => {
			const callbacks = [];

			jwplayerStub.on.callsFake((name: string, cb) => {
				if (name === 'adError') {
					callbacks.push(cb);
				}
			});
			createJwpStatelessStream(jwplayerStub)
				.pipe(ofJwpEvent('adError'))
				.subscribe(({ payload }) => {
					expect(payload.tag).to.equal(null);
				});
			callbacks.forEach((cb) => cb());
		});

		it('should contain tag from latest adRequest if no tag in adError', () => {
			const tag = 'test-tag';
			const callbacks = [];

			jwplayerStub.on.callsFake((name: string, cb) => {
				if (name === 'adRequest') {
					callbacks.push(() => cb({ tag }));
				}
			});
			createJwpStatelessStream(jwplayerStub)
				.pipe(ofJwpEvent('adError'))
				.subscribe(({ payload }) => {
					expect(payload.tag).to.equal(tag);
				});
			callbacks.forEach((cb) => cb());
		});

		it('should contain tag from latest adError', () => {
			const adRequestTag = 'ad-request-tag';
			const adErrorTag = 'ad-error-tag';
			const callbacks = [];

			jwplayerStub.on.callsFake((name: string, cb) => {
				if (name === 'adRequest') {
					callbacks.push(() => cb({ tag: adRequestTag }));
				}
				if (name === 'adError') {
					callbacks.push(() => cb({ tag: adErrorTag }));
				}
			});
			createJwpStatelessStream(jwplayerStub)
				.pipe(ofJwpEvent('adError'))
				.subscribe(({ payload }) => {
					expect(payload.tag).to.equal(adErrorTag);
				});
			callbacks.forEach((cb) => cb());
		});
	});

	describe('adError and beforePlay', () => {
		it('should emit onlyOncePerVideo', () => {
			const callbacks = {
				adError: undefined,
				beforePlay: undefined,
			};
			const counters = {
				adError: 0,
				beforePlay: 0,
			};

			jwplayerStub.on.callsFake((name: string, cb) => {
				if (['adError', 'beforePlay'].includes(name)) {
					callbacks[name] = cb;
				}
			});
			jwplayerStub.getPlaylistItem.returns({ mediaid: 1 });

			createJwpStatelessStream(jwplayerStub).subscribe(({ name }) => (counters[name] += 1));

			expect(counters.adError).to.equal(0);
			expect(counters.beforePlay).to.equal(0);

			callbacks.beforePlay();

			expect(counters.adError).to.equal(0);
			expect(counters.beforePlay).to.equal(1);

			callbacks.adError();

			expect(counters.adError).to.equal(1);
			expect(counters.beforePlay).to.equal(1);

			callbacks.adError();
			callbacks.beforePlay();

			expect(counters.adError).to.equal(1);
			expect(counters.beforePlay).to.equal(1);

			jwplayerStub.getPlaylistItem.returns({ mediaid: 2 });
			callbacks.adError();
			callbacks.beforePlay();

			expect(counters.adError).to.equal(2);
			expect(counters.beforePlay).to.equal(2);
		});
	});
});
