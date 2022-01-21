import { action, globalAction } from '@wikia/communication';
import { CommunicationService } from '@wikia/communication/communication-service';
import { Communicator } from '@wikia/post-quecast';
import { expect } from 'chai';
import { Subject } from 'rxjs';
import { createSandbox } from 'sinon';
import { Action, props } from 'ts-action';

describe('CommunicationService', () => {
	const sandbox = createSandbox();
	const localExample = action('[Example] Test', props<{ foo: string }>());
	const globalExample = globalAction('[Example] Test', props<{ bar: string }>());
	const globalEvent = { category: '[Example]', name: 'Test', payload: props<{ bar: string }>() };

	afterEach(() => {
		sandbox.restore();
	});

	it('should return a correct global action', () => {
		const service = new CommunicationService();

		expect(service.getGlobalAction(globalEvent)({ bar: 'test' })).to.deep.equal(
			globalExample({ bar: 'test' }),
		);
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
		service.emit(globalEvent, { bar: 'e' });

		expect(nextResults).to.deep.equal([
			{ type: '[Example] Test', foo: 'a' },
			{ type: '[Example] Test', foo: 'c' },
		]);

		expect(dispatchResults).to.deep.equal([
			{ type: '[Example] Test', bar: 'b', __global: true },
			{ type: '[Example] Test', bar: 'd', __global: true },
			{ type: '[Example] Test', bar: 'e', __global: true },
		]);
	});

	it('should listen correct actions', () => {
		const results: Action[] = [];
		const localSubject = new Subject<Action>();
		const globalSubject = new Subject<Action>();

		sandbox
			.stub(Communicator.prototype, 'addListener')
			.callsFake((cb) => globalSubject.subscribe(cb));
		sandbox.stub(Subject.prototype, 'asObservable').returns(localSubject);

		const service = new CommunicationService();

		service.action$.subscribe((value) => results.push(value));

		localSubject.next(localExample({ foo: 'localSubject - a' }));
		localSubject.next(globalExample({ bar: 'localSubject - b' }));
		globalSubject.next(localExample({ foo: 'globalSubject - c' }));
		globalSubject.next(globalExample({ bar: 'globalSubject - d' }));

		expect(results).to.deep.equal([
			{ type: '[Example] Test', foo: 'localSubject - a' },
			{ type: '[Example] Test', bar: 'globalSubject - d', __global: true },
		]);
	});
});
