type Application = 'futhead' | 'muthead';

let application: Application;

function getApplication(): Application {
	if (!application) {
		application = window.location.host.includes('futhead') ? 'futhead' : 'muthead';
	}

	return application;
}

export function selectApplication(futhead: any = null, muthead: any = null): any | null {
	if (getApplication() === 'futhead') {
		return futhead;
	}

	if (getApplication() === 'muthead') {
		return muthead;
	}

	throw new Error('Unknown Sports Application');
}
