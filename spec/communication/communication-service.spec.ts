import { action, CommunicationService, globalAction } from '@wikia/communication';
import { Communicator } from '@wikia/post-quecast';
import { expect } from 'chai';
import { Subject } from 'rxjs';
import { createSandbox } from 'sinon';
import { Action, props } from 'ts-action';

describe('CommunicationService', () => {
	const sandbox = createSandbox();
	const localExample = action('[Local]', props<{ foo: string }>());
	const globalExample = globalAction('[Global]', props<{ bar: string }>());

	afterEach(() => {
		sandbox.restore();
	});

	it('should dispatch correct action', () => {
		const nextResults: Action[] = [];
		const dispatchResults: Action[] = [];

		sandbox.stub(Subject.prototype, 'next').callsFake((value) => nextResults.push(value));
		sandbox
			.stub(Communicator.prototype, 'dispatch')
			.callsFake((value) => dispatchResults.push(value));

		const service = new CommunicationService();

		service.dispatch(localExample({ foo: 'a' }));
		service.dispatch(globalExample({ bar: 'b' }));
		service.dispatch(localExample({ foo: 'c' }));
		service.dispatch(globalExample({ bar: 'd' }));

		expect(nextResults).to.deep.equal([
			{ type: '[Local]', foo: 'a' },
			{ type: '[Local]', foo: 'c' },
		]);

		expect(dispatchResults).to.deep.equal([
			{ type: '[Global]', bar: 'b', __global: true },
			{ type: '[Global]', bar: 'd', __global: true },
		]);
	});

	it.skip('should listen correct actions', () => {
		const results: Action[] = [];
		const localSubject = new Subject<Action>();
		const globalSubject = new Subject<Action>();

		// TODO: Make this stub work and unskip the test.
		sandbox.stub(Communicator.prototype, 'actions$').value(globalSubject);
		sandbox.stub(Subject.prototype, 'asObservable').returns(localSubject);

		const service = new CommunicationService();

		service.action$.subscribe((value) => results.push(value));

		localSubject.next(localExample({ foo: 'localSubject - a' }));
		localSubject.next(globalExample({ bar: 'localSubject - b' }));
		globalSubject.next(localExample({ foo: 'globalSubject - c' }));
		globalSubject.next(globalExample({ bar: 'globalSubject - d' }));

		console.log(results);

		expect(results).to.deep.equal([
			{ type: '[Local]', foo: 'localSubject - a' },
			{ type: '[Global]', bar: 'globalSubject - d', __global: true },
		]);
	});
});
