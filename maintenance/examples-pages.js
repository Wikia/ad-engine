const fs = require('fs');
const path = require('path');

const examplePages = {};

function findExamplePages(startPath, filter) {
	if (!fs.existsSync(startPath)) {
		return;
	}

	const files = fs.readdirSync(startPath);

	files.forEach((file) => {
		const filename = path.join(startPath, file);
		const stat = fs.lstatSync(filename);

		if (stat.isDirectory()) {
			findExamplePages(filename, filter);
		} else if (filename.indexOf(filter) >= 0) {
			const shortName = filename.replace('examples/', '').replace('/script.ts', '');

			examplePages[shortName] = `./${filename}`;
		}
	});
}

findExamplePages('./examples', 'script.ts');

module.exports.examplePages = examplePages;
