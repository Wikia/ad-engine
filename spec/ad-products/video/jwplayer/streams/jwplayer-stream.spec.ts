// @ts-strict-ignore
import { jwpEvents } from '@wikia/ad-products/video/jwplayer/streams/jwplayer-events';
import {
	createJwpStream,
	JwpEvent,
} from '@wikia/ad-products/video/jwplayer/streams/jwplayer-stream';
import { expect } from 'chai';
import { Subscription } from 'rxjs';
import { createJwplayerStub, JwplayerStub } from '../jwplayer.stub';

describe('Jwplayer Stream', () => {
	let jwplayerStub: JwplayerStub;
	let results: JwpEvent<any>[];
	let subscription: Subscription;

	beforeEach(() => {
		const callbacks = [];

		results = [];
		jwplayerStub = createJwplayerStub(global.sandbox);
		jwplayerStub.getConfig.returns({ itemReady: true });
		jwplayerStub.on.callsFake((name: string, cb) => {
			callbacks.push(cb);
		});
		subscription = createJwpStream(jwplayerStub).subscribe((value) => results.push(value));
		callbacks.forEach((cb) => cb({ tag: 'test-tag' }));
	});

	afterEach(() => {
		subscription.unsubscribe();
	});

	it('should emit all events', () => {
		expect(results.map((value) => value.name).sort()).to.deep.equal([...jwpEvents].sort());
	});

	it('should contain event with state', () => {
		results.forEach((event) => {
			expect(typeof event.state).to.equal('object');
		});
	});
});
