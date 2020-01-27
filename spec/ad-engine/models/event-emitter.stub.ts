import * as EventEmitter from 'eventemitter3';
import { SinonSandbox, SinonStub } from 'sinon';

export type EventEmitterStub = { [key in keyof EventEmitter]: SinonStub & EventEmitter[key] };

export function createEventEmitterStub(sandbox: SinonSandbox): EventEmitterStub {
	return {
		addListener: sandbox.stub(),
		emit: sandbox.stub(),
		eventNames: sandbox.stub(),
		listenerCount: sandbox.stub(),
		listeners: sandbox.stub(),
		off: sandbox.stub(),
		on: sandbox.stub(),
		once: sandbox.stub(),
		removeAllListeners: sandbox.stub(),
		removeListener: sandbox.stub(),
	};
}
