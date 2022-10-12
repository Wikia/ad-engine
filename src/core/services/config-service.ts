import { context } from './context-service';

/*
 *  ToDo: Development improvement refactor
 *  This class is about to be expanded in ADEN-10310
 */
class Config {
	public rollout = {
		coppaFlag: () => {
			return {
				gam: context.get('options.coppaGam'),
				prebid: context.get('options.coppaPrebid'),
			};
		},
	};
}

export const config = new Config();
