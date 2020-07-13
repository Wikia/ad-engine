import { TemplateTransition } from './template-state-transition';

export interface TemplateStateHandler<T extends string = string> {
	onEnter(transition: TemplateTransition<T>): Promise<void>;

	onLeave?(): Promise<void>;

	onDestroy?(): Promise<void>;
}
