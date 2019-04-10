const express = require('express');

class StaticFilesServerLauncher {
	onPrepare({ staticFilesServerConfig }) {
		if (!staticFilesServerConfig) {
			return Promise.resolve();
		}

		const { basename, mount, port } = staticFilesServerConfig;

		this.server = express();
		this.server.use(basename, express.static(mount));

		return new Promise((resolve, reject) => {
			this.server.listen(port, (err) => {
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
