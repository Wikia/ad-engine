import { AdSlot, Dictionary } from '../models';
import { logger } from '../utils';
import { context } from './context-service';
import { TemplateRegistry } from './templates-registry/template-registry';

const logGroup = 'template-service';

class TemplateService {
	private registry?: TemplateRegistry;
	private templates: Dictionary = {};

	setRegistry(registry: TemplateRegistry): void {
		this.registry = registry;
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
		try {
			this.registry.init(name, slot, params);
			return;
		} catch (e) {
			// simply use old template service
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
}

export const templateService = new TemplateService();
