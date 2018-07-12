/* eslint-disable no-console, import/no-extraneous-dependencies, import/no-unresolved */
const { IncomingWebhook } = require('@slack/client');
const { version } = require('../package.json');
const { version: previousVersion } = require('./previous-package.json');

const failed = process.argv[2] === 'failure';
const repositoryName = 'ad-engine';
const buildUrl = process.env.BUILD_URL;
const webhookUrl = process.env.SLACK_INCOMING_WEBHOOK;

if (!webhookUrl) {
	console.warn('Missing slack incoming webhook url. Message will not be sent.');
	return;
}

const webhook = new IncomingWebhook(webhookUrl);

let text;
let attachments = [];

if (failed) {
	text = `:x: <!here|here>: Something went wrong during *${repositoryName}* release (<${buildUrl}|show log>)`;
} else {
	const releaseLink = `<https://github.com/Wikia/${repositoryName}/releases/tag/v${version}|Release v${version}>`;
	let diffLink = '';

	if (previousVersion) {
		diffLink = `(<https://github.com/Wikia/${repositoryName}/compare/v${previousVersion}...v${version}|show diff>)`;
	}

	text = `New version of *${repositoryName}* has been released: ${releaseLink} ${diffLink}`;
	attachments = [
		{
			color: '#00acac',
			text: 'Install new version in:',
			actions: [
				{
					type: 'button',
					text: 'ad-products',
					url: `http://jenkins:8080/job/update_dependencies_adproducts/parambuild/?adengine_version=v${version}`
				}
			]
		}
	];
}

webhook.send({
	text,
	attachments
}, (error, response) => {
	if (error) {
		console.error(error);
	} else {
		console.log('Message successfully sent.', response);
	}
});
