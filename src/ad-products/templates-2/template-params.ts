import { Dictionary } from '@ad-engine/core';

/**
 * TemplateParams to be used in TemplateStateHandler
 * They are delivered from GAM
 */
export class TemplateParams implements Dictionary {
	templateName: string;
	[key: string]: any;
}
