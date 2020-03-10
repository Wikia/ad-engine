import { vastParser } from '@wikia/ad-engine';
import { jwpEvents } from '@wikia/ad-products/video/jwplayer/streams/jwplayer-events';
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
	let results: JwpState[];

	beforeEach(() => {
		results = [];
		jwplayerStub = createJwplayerStub(sandbox);
		subject$ = new Subject();
		state$ = createJwpStateStream(subject$.asObservable().pipe(shareReplay(1)), jwplayerStub);
		state$.subscribe((value) => results.push(value));
	});

	afterEach(() => {
		sandbox.restore();
		subject$.complete();
	});

	describe('VideoDepth', () => {
		it('should increase depth and change correlator every beforePlay event', () => {
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

	describe('AdInVideo', () => {
		it('should be bootstrap at first play', () => {
			subject$.next({ name: 'beforeComplete', payload: undefined });
			subject$.next({ name: 'videoMidPoint', payload: undefined });
			expect(uniq(results.map((value) => value.adInVideo))[0]).to.equal('bootstrap');
		});

		it('should reset to cone after complete', () => {
			subject$.next({ name: 'beforeComplete', payload: undefined });
			subject$.next({ name: 'videoMidPoint', payload: undefined });
			subject$.next({ name: 'complete', payload: undefined });
			expect(uniq(results.map((value) => value.adInVideo))[1]).to.equal('none');
		});

		it('should reflect beforePlay', () => {
			subject$.next({ name: 'beforePlay', payload: undefined });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(uniq(results.map((value) => value.adInVideo))[1]).to.equal('preroll');
		});

		it('should reflect videoMidPoint', () => {
			subject$.next({ name: 'beforePlay', payload: undefined });
			subject$.next({ name: 'videoMidPoint', payload: undefined });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(uniq(results.map((value) => value.adInVideo))[1]).to.equal('midroll');
		});

		it('should reflect beforeComplete', () => {
			subject$.next({ name: 'beforePlay', payload: undefined });
			subject$.next({ name: 'videoMidPoint', payload: undefined });
			subject$.next({ name: 'beforeComplete', payload: undefined });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(uniq(results.map((value) => value.adInVideo))[1]).to.equal('postroll');
		});
	});

	describe('VastParams', () => {
		beforeEach(() => {
			sandbox.stub(vastParser, 'parse').callsFake((arg) => arg as any);
		});

		it('should start with default', () => {
			subject$.next({ name: 'beforePlay', payload: undefined });
			expect(results[0].vastParams).to.deep.equal({
				contentType: undefined,
				creativeId: undefined,
				customParams: {},
				lineItemId: undefined,
				position: undefined,
				size: undefined,
			});
		});

		it('should update after adRequest, adError, adImpression', () => {
			['adRequest', 'adError', 'adImpression'].forEach((name) => {
				subject$.next({ name, payload: { tag: name } });
			});
			expect(uniq(results.map((val) => val.vastParams))).to.deep.equal([
				'adRequest',
				'adError',
				'adImpression',
			]);
		});
	});

	describe('Common', () => {
		it('should update common properties on every event', () => {
			jwpEvents.forEach((name, index) => {
				jwplayerStub.getPlaylistItem.returns(`getPlaylistItem-${index}`);
				jwplayerStub.getConfig.returns(`getConfig-${index}`);
				jwplayerStub.getMute.returns(`getMute-${index}`);
				subject$.next({ name, payload: { tag: 'a' } });
			});

			expect(uniqBy(results, 'playlistItem').length).to.equal(jwpEvents.length);
			expect(uniqBy(results, 'config').length).to.equal(jwpEvents.length);
			expect(uniqBy(results, 'mute').length).to.equal(jwpEvents.length);
		});
	});
});
