import {
	createJwpStateStream,
	JwpState,
} from '@wikia/ad-products/video/jwplayer/streams/jwplayer-stream-state';
import { JwpStatelessEvent } from '@wikia/ad-products/video/jwplayer/streams/jwplayer-stream-stateless';
import { expect } from 'chai';
import { uniq, uniqBy } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { createSandbox } from 'sinon';
import { createJwplayerStub, JwplayerStub } from '../jwplayer.stub';

describe('Jwplayer Stream State', () => {
	const sandbox = createSandbox();
	let jwplayerStub: JwplayerStub;
	let subject$: Subject<JwpStatelessEvent<any>>;
	let state$: Observable<JwpState>;

	beforeEach(() => {
		jwplayerStub = createJwplayerStub(sandbox);
		subject$ = new Subject();
		state$ = createJwpStateStream(subject$.asObservable().pipe(shareReplay(1)), jwplayerStub);
	});

	afterEach(() => {
		sandbox.restore();
		subject$.complete();
	});

	describe('VideoDepth', () => {
		it('should increase depth and change correlator every beforePlay event', () => {
			const results = [];

			state$.subscribe((value) => results.push(value));

			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			expect(results[0].correlator).to.equal(0);
			expect(results[0].depth).to.equal(0);

			subject$.next({ name: 'beforePlay', payload: undefined });
			expect(uniq(results.map((value) => value.depth))).to.deep.equal([0, 1]);
			expect(uniqBy(results, 'correlator').length).to.equal(2);

			subject$.next({ name: 'videoMidPoint', payload: undefined });
			subject$.next({ name: 'beforeComplete', payload: undefined });
			expect(uniq(results.map((value) => value.depth))).to.deep.equal([0, 1]);
			expect(uniqBy(results, 'correlator').length).to.equal(2);

			subject$.next({ name: 'beforePlay', payload: undefined });
			subject$.next({ name: 'videoMidPoint', payload: undefined });
			expect(uniq(results.map((value) => value.depth))).to.deep.equal([0, 1, 2]);
			expect(uniqBy(results, 'correlator').length).to.equal(3);
		});
	});
});
