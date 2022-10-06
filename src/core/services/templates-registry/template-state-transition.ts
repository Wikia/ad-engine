export interface TemplateTransitionOptions {
	allowMulticast?: boolean;
}

export type TemplateTransition<T extends string = string> = (
	targetStateKey: T,
	options?: TemplateTransitionOptions,
) => Promise<void>;
