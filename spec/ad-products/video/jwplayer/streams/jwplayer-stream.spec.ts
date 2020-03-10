import { jwpEvents } from '@wikia/ad-products/video/jwplayer/streams/jwplayer-events';
import {
	createJwpStream,
	JwpEvent,
} from '@wikia/ad-products/video/jwplayer/streams/jwplayer-stream';
import { expect } from 'chai';
import { Subscription } from 'rxjs';
import { createSandbox } from 'sinon';
import { createJwplayerStub, JwplayerStub } from '../jwplayer.stub';

describe('Jwplayer Stream', () => {
	const sandbox = createSandbox();
	let jwplayerStub: JwplayerStub;
	let results: JwpEvent<any>[];
	let subscription: Subscription;

	beforeEach(() => {
		results = [];
		jwplayerStub = createJwplayerStub(sandbox);
		jwplayerStub.getConfig.returns({ itemReady: true });
		jwplayerStub.on.callsFake((name: string, cb) => {
			return cb({ tag: 'test-tag' });
		});
		subscription = createJwpStream(jwplayerStub).subscribe((value) => results.push(value));
	});

	afterEach(() => {
		sandbox.restore();
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
