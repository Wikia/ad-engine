/*
 *  ToDo: Development improvement refactor
 *  This class is about to be expanded in ADEN-10310
 */
class Config {
	public rollout = {
		coppaFlag: () => {
			return {
				gam: true,
				prebid: true,
			};
		},
	};
}

export const config = new Config();
