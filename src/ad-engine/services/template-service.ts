import { AdSlot, Dictionary } from '../models';
import { logger } from '../utils/logger';
import { context } from './context-service';

const logGroup = 'template-service';
const templates = {};

class TemplateService {
	register(template, customConfig = null): void {
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
		templates[name] = template;
	}

	init(name: string, slot: AdSlot = null, params: Dictionary = {}): void {
		logger(logGroup, 'Load template', name, slot, params);

		if (!templates[name]) {
			throw new Error(`Template ${name} does not exist.`);
		}

		// override params.slotName by splitting it by comma
		// and picking first occurrence so we can rely on it
		// in used creative templates
		if (params && (typeof params.slotName === 'string' || params.slotName instanceof String)) {
			params.slotName = params.slotName.split(',').shift();
		}

		return new templates[name](slot).init(params);
	}
}

export const templateService = /*@__PURE__*/ new TemplateService();
