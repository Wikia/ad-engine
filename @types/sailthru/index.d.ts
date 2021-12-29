interface SailthruIntegrationData {
	email: string;
	vars: {
		sign_up_date: string;
		email: string;
	};
	lists: { 'Fandom Account Registration - MASTERLIST': number };
	source: string;
	onSuccess: () => void;
	onError: () => void;
}

interface Sailthru {
	init?: ({ customerId: string }) => void;
	integration?: (name: string, data: SailthruIntegrationData) => void;
}
