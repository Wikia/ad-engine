class Sailthru {
	isLoaded(): boolean {
		return !!window.Sailthru;
	}

	signup(email: string, onSuccess, onError): void {
		window.Sailthru.integration('userSignUp', {
			email,
			onSuccess,
			onError,
			vars: {
				email,
				sign_up_date: new Date().toISOString(),
			},
			lists: { 'Fandom Account Registration - MASTERLIST': 1 },
			source: 'homepage_hero_unit',
		});
	}
}

export const sailthru = new Sailthru();
