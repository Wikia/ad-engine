import { logger } from '../utils/logger';
import { context } from './context-service';

const logGroup = 'template-service',
	templates = {},
	templatesGlobal = [];

class TemplateService {
	register(template, customConfig = null) {
		if (typeof template.getName !== 'function') {
			throw new Error('Template does not implement getName method.');
		}
		const name = template.getName();

		let config = context.get(`templates.${name}`) || {};

		if (typeof template.getDefaultConfig === 'function') {
			config = Object.assign(template.getDefaultConfig(), config);
		}

		if (customConfig) {
			config = Object.assign(config, customConfig);
		}

		context.set(`templates.${name}`, config);

		if (config.isGlobalTemplate) {
			templatesGlobal.push(template);
		} else {
			templates[name] = template;
		}
	}

	init(name, slot = null, params = {}) {
		logger(logGroup, 'Load template', name, slot, params);

		if (!templates[name]) {
			throw new Error(`Template ${name} does not exist.`);
		}

		return new templates[name](slot).init(params);
	}

	initGlobal(slot = null) {
		logger(logGroup, 'Load global templates', slot);

		for (let i = 0; i < templatesGlobal.length; i += 1) {
			new templatesGlobal[i](slot).init({});
		}
	}
}

export const templateService = new TemplateService();
