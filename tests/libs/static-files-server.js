const express = require('express');

class StaticFilesServerLauncher {
	onPrepare({ staticFilesServerConfig }) {
		if (!staticFilesServerConfig) {
			return Promise.resolve();
		}

		const { basename, mount, port } = staticFilesServerConfig;
		const server = express();

		server.use(basename, express.static(mount));

		return new Promise((resolve, reject) => {
			server.listen(port, (err) => {
				if (err) {
					reject(err);
					return;
				}

				resolve();
			});
		});
	}
}

module.exports = StaticFilesServerLauncher;
