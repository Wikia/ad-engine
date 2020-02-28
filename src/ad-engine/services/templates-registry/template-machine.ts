import { Subject } from 'rxjs';
import { Dictionary } from '../../models';
import { TemplateAction } from './template-action';
import { TemplateState } from './template-state';
import { TemplateStateHandler } from './template-state-handler';
import { TemplateTransition } from './template-state-transition';

export class TemplateMachine<T extends Dictionary<TemplateStateHandler<keyof T>[]> = any> {
	private get currentState(): TemplateState<keyof T> {
		if (!this.states.has(this.currentStateKey)) {
			throw new Error(
				`Template ${this.templateName} - state (${this.currentStateKey}) does not exist.`,
			);
		}

		return this.states.get(this.currentStateKey);
	}

	constructor(
		private templateName: string,
		private states: Map<keyof T, TemplateState<keyof T>>,
		private currentStateKey: keyof T,
		private emitter$: Subject<TemplateAction>,
	) {}

	async init(): Promise<void> {
		this.emit('initialising');
		await this.currentState.enter(this.transition);
		this.emit('initialised');
	}

	private transition: TemplateTransition<keyof T> = async (targetStateKey) => {
		if (this.currentStateKey === targetStateKey) {
			throw new Error(
				`Template ${this.templateName} - already is in ${this.currentStateKey} state`,
			);
		}

		this.emit('leaving');
		await this.currentState.leave();
		this.emit('left');

		this.currentStateKey = targetStateKey;

		this.emit('entering');
		await this.currentState.enter(this.transition);
		this.emit('entered');
	};

	private emit(type: TemplateAction['type']): void {
		this.emitter$.next({
			type,
			templateName: this.templateName,
			stateName: this.currentStateKey,
		});
	}
}
