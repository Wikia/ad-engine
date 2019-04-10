const logger = require('@wdio/logger');
const express = require('express');

class StaticFilesServerLauncher {
	onPrepare({ staticFilesServerConfig }) {
		if (!staticFilesServerConfig) {
			return Promise.resolve();
		}

		const { basename, mount, port } = staticFilesServerConfig;
		const log = logger.default('@wikia/static-files-server');
		const server = express();

		log.info(`Mounting "${mount}" directory on "${basename}"`);
		server.use(basename, express.static(mount));

		return new Promise((resolve, reject) => {
			server.listen(port, (err) => {
				if (err) {
					reject(err);
					return;
				}

				log.info(`Server is running on http://localhost:${port}`);
				resolve();
			});
		});
	}
}

module.exports = StaticFilesServerLauncher;
