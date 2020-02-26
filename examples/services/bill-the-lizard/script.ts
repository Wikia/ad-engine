import {
	AdEngine,
	billTheLizard,
	billTheLizardEvents,
	context,
	eventService,
	utils,
} from '@wikia/ad-engine';
import adContext from '../../context';

const allPredictionsElement = document.getElementById('predictions-all');
const allStatusesElement = document.getElementById('status-all');
const predictionsElement = document.getElementById('predictions');
const serializedElement = document.getElementById('serialized');
const statusElement = document.getElementById('status');
const targetingElement = document.getElementById('targeting');

const enabledProjects = utils.queryString.get('enabled-project');

function makeCall(lazyCallProject = null, callId?: string | number) {
	billTheLizard.call(lazyCallProject, callId).then(
		(predictions) => {
			allPredictionsElement.innerText = JSON.stringify(billTheLizard.getPredictions(), null, 2);
			allStatusesElement.innerText = JSON.stringify(billTheLizard.statuses, null, 2);
			predictionsElement.innerText = 'Model name\t\tPrediction\n';
			predictionsElement.innerText += Object.keys(predictions)
				.map((key) => `${key}\t\t${predictions[key]}`)
				.join('\n');
			serializedElement.innerText = billTheLizard.serialize();
			statusElement.innerText = billTheLizard.getResponseStatus();
			targetingElement.innerText = billTheLizard.setTargeting().join(',');
		},
		(response) => {
			console.error(`❗ Error : ${response.message}`);

			predictionsElement.innerText = '';
			serializedElement.innerText = billTheLizard.serialize();
			statusElement.innerText = billTheLizard.getResponseStatus();
		},
	);
}

eventService.on(billTheLizardEvents.BILL_THE_LIZARD_REQUEST, (query) => {
	console.log('⛳ bill-the-lizard requested', query);
});

context.extend(adContext);

if (enabledProjects) {
	enabledProjects.split(',').forEach((name) => billTheLizard.projectsHandler.enable(name));
} else {
	billTheLizard.projectsHandler.enable('queen_of_hearts');
}

billTheLizard.executor.register('logResult', (model, prediction) => {
	console.log(`🦎 %c${model.name}`, 'font-weight: bold', `predicted ${prediction}`);
});

makeCall(['queen_of_hearts']);

setTimeout(() => {
	new AdEngine(context).init();
}, 1000);

document.getElementById('lazyCallCat').addEventListener('click', () => {
	makeCall(['cheshirecat']);
});

document.getElementById('lazyCallCatWithId').addEventListener('click', () => {
	makeCall(['cheshirecat'], 'catCall');
});

document.getElementById('reset').addEventListener('click', () => {
	billTheLizard.reset();
});
