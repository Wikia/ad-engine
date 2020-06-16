import { communicationService, globalAction, ofType } from '@ad-engine/communication';
import { tap } from 'rxjs/operators';
import { payload } from 'ts-action';
import { AdSlot, Dictionary } from '../models';
import { logger } from '../utils';
import { context, slotService } from './';

const logGroup = 'template-service';

type TemplateInitializer = Pick<TemplateService, 'init'> & { has: (name: string) => boolean };

interface LoadTemplatePayload {
	slotName: string;
	type: string;
}

export const loadTemplate = globalAction(
	'[GAM iframe] Load template',
	payload<LoadTemplatePayload>(),
);

class TemplateService {
	private initializer?: TemplateInitializer;
	private templates: Dictionary = {};

	setInitializer(initializer: TemplateInitializer): void {
		this.initializer = initializer;
	}

	register(template: any, customConfig: any = null): void {
		if (typeof template.getName !== 'function') {
			throw new Error('Template does not implement getName method.');
		}
		const name = template.getName();

		let config = context.get(`templates.${name}`) || {};

		if (typeof template.getDefaultConfig === 'function') {
			config = { ...template.getDefaultConfig(), ...config };
		}

		if (customConfig) {
			config = { ...config, ...customConfig };
		}

		context.set(`templates.${name}`, config);
		this.templates[name] = template;
	}

	init(name: string, slot: AdSlot = null, params: Dictionary = {}): void {
		if (this.initializer?.has(name)) {
			return this.initializer.init(name, slot, params);
		}

		logger(logGroup, 'Load template', name, slot, params);

		if (!this.templates[name]) {
			throw new Error(`Template ${name} does not exist.`);
		}

		// override params.slotName by splitting it by comma
		// and picking first occurrence so we can rely on it
		// in used creative templates
		if (params && (typeof params.slotName === 'string' || params.slotName instanceof String)) {
			params.slotName = params.slotName.split(',').shift();
		}

		return new this.templates[name](slot).init(params);
	}

	subscribeCommunicator(): void {
		communicationService.action$
			.pipe(
				ofType(loadTemplate),
				tap(({ payload }: { payload: LoadTemplatePayload }) => {
					const adSlot = slotService.get(payload.slotName);

					this.init(payload.type, adSlot, payload);
				}),
			)
			.subscribe();
	}
}

export const templateService = new TemplateService();
