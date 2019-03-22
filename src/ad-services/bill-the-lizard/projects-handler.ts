import { context, utils } from '@wikia/ad-engine';

const logGroup = 'project-handler';

/**
 * Bill the Lizard projects handler
 */
export class ProjectsHandler {
	projects = {};

	/**
	 * Enables project by name
	 * @param {string} name
	 */
	enable(name) {
		utils.logger(logGroup, `project ${name} enabled`);
		this.projects[name] = true;
	}

	/**
	 * Checks whether project is enabled
	 * @param {string} name
	 * @returns {boolean}
	 */
	isEnabled(name) {
		return !!this.projects[name];
	}

	/**
	 * Returns all geo-enabled models' definitions based on enabled projects
	 * @param {string[]} projectNames
	 * @returns {{models: ModelDefinition[], parameters: Object}}
	 */
	getEnabledModelsWithParams(projectNames) {
		const projects = context.get('services.billTheLizard.projects') || {};
		const projectParameters = context.get('services.billTheLizard.parameters') || {};
		const enabledProjectNames = Object.keys(projects).filter(
			(name) => this.isEnabled(name) && projectNames.includes(name),
		);
		const models = [];
		const parameters = {};

		enabledProjectNames.forEach((name) => {
			// Only first enabled model in project is executable
			let isNextModelExecutable = true;

			projects[name].forEach((model) => {
				if (utils.geoService.isProperGeo(model.countries, model.name)) {
					model.executable = isNextModelExecutable;
					isNextModelExecutable = false;
					models.push(model);
					Object.assign(parameters, projectParameters[name]);
				} else {
					model.executable = false;
				}
			});
		});

		return {
			models,
			parameters,
		};
	}
}
