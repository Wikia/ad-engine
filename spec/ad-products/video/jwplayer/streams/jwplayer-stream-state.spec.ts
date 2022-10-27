import { context, vastParser } from '@wikia/core';
import { jwpEvents } from '@wikia/ad-products/video/jwplayer/streams/jwplayer-events';
import {
	createJwpStateStream,
	JwpState,
} from '@wikia/ad-products/video/jwplayer/streams/jwplayer-stream-state';
import { JwpStatelessEvent } from '@wikia/ad-products/video/jwplayer/streams/jwplayer-stream-stateless';
import { expect } from 'chai';
import { Observable, Subject } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { createSandbox } from 'sinon';
import { createJwplayerStub, JwplayerStub } from '../jwplayer.stub';

function uniq(array) {
	return [...new Set(array)];
}

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

		context.remove('options.video.forceVideoAdsOnAllVideosExceptSecond');
	});

	describe('VideoDepth', () => {
		it('should increase depth and change correlator every beforePlay event', () => {
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			expect(results[0].correlator).to.equal(0);
			expect(results[0].depth).to.equal(0);

			subject$.next({ name: 'beforePlay', payload: undefined });
			expect(uniq(results.map((value) => value.depth))).to.deep.equal([0, 1]);
			expect(uniq(results.map((value) => value.correlator)).length).to.equal(2);

			subject$.next({ name: 'videoMidPoint', payload: undefined });
			subject$.next({ name: 'beforeComplete', payload: undefined });
			expect(uniq(results.map((value) => value.depth))).to.deep.equal([0, 1]);
			expect(uniq(results.map((value) => value.correlator)).length).to.equal(2);

			subject$.next({ name: 'beforePlay', payload: undefined });
			subject$.next({ name: 'videoMidPoint', payload: undefined });
			expect(uniq(results.map((value) => value.depth))).to.deep.equal([0, 1, 2]);
			expect(uniq(results.map((value) => value.correlator)).length).to.equal(3);
		});
	});

	describe('Ad requests count (rv key-val)', () => {
		it('should increase rv after every preroll in the same slot except sponsored video', () => {
			// init
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			expect(results[0].rv).to.equal(1, 'rv in the initial adRequest is incorrect');

			// first video and preroll
			subject$.next({ name: 'beforePlay', payload: undefined });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[3].rv).to.equal(1, 'rv for preroll before 1st video is incorrect');

			// midroll
			subject$.next({ name: 'videoMidPoint', payload: undefined });
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[10].rv).to.equal(2, 'rv for midroll in 1st video is incorrect');

			// postroll
			subject$.next({ name: 'beforeComplete', payload: undefined });
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[13].rv).to.equal(3, 'rv for postroll after 1st video is incorrect');

			subject$.next({ name: 'complete', payload: undefined });

			// second video and preroll - not sponsored
			subject$.next({ name: 'beforePlay', payload: undefined });
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[25].rv).to.equal(4, 'rv for preroll before 2nd video is incorrect');

			// midroll
			subject$.next({ name: 'videoMidPoint', payload: undefined });
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[31].rv).to.equal(5, 'rv for midroll in 2nd video is incorrect');

			// postroll
			subject$.next({ name: 'beforeComplete', payload: undefined });
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[37].rv).to.equal(6, 'rv for postroll after 2nd video is incorrect');

			subject$.next({ name: 'complete', payload: undefined });

			// third video and preroll - not sponsored
			subject$.next({ name: 'beforePlay', payload: undefined });
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[46].rv).to.equal(7, 'rv for preroll before 3rd video is incorrect');

			// midroll
			subject$.next({ name: 'videoMidPoint', payload: undefined });
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[52].rv).to.equal(8, 'rv for midroll in 3rd video is incorrect');

			// postroll
			subject$.next({ name: 'beforeComplete', payload: undefined });
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[58].rv).to.equal(9, 'rv for postroll after 3rd video is incorrect');

			subject$.next({ name: 'complete', payload: undefined });

			// fourth video and preroll - sponsored
			subject$.next({ name: 'beforePlay', payload: undefined });
			expect(results[62].rv).to.equal(9, 'rv for preroll before 4th video is incorrect');

			// midroll
			subject$.next({ name: 'videoMidPoint', payload: undefined });
			expect(results[63].rv).to.equal(9, 'rv for midroll in 4th video is incorrect');

			// postroll
			subject$.next({ name: 'beforeComplete', payload: undefined });
			expect(results[64].rv).to.equal(9, 'rv for postroll after 4th video is incorrect');

			subject$.next({ name: 'complete', payload: undefined });

			// fifth video and preroll - not sponsored
			subject$.next({ name: 'beforePlay', payload: undefined });
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[73].rv).to.equal(10, 'rv for preroll before 5th video is incorrect');

			// midroll
			subject$.next({ name: 'videoMidPoint', payload: undefined });
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[79].rv).to.equal(11, 'rv for midroll in 5th video is incorrect');

			// postroll
			subject$.next({ name: 'beforeComplete', payload: undefined });
			subject$.next({ name: 'adRequest', payload: { tag: 'tag' } });
			subject$.next({ name: 'adStarted', payload: undefined });
			expect(results[85].rv).to.equal(12, 'rv for postroll after 5th video is incorrect');
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

			expect(uniq(results.map((value) => value.playlistItem)).length).to.equal(jwpEvents.length);
			expect(uniq(results.map((value) => value.config)).length).to.equal(jwpEvents.length);
			expect(uniq(results.map((value) => value.mute)).length).to.equal(jwpEvents.length);
		});
	});
});
