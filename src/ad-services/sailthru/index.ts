export interface UserSignupPayload {
	email: string;
	onSuccess: () => void;
	onError: () => void;
}

type SailthruSource = 'adengine_in_content_ad';

class Sailthru {
	isLoaded(): boolean {
		return !!window.Sailthru;
	}

	userSignup({ email, onSuccess, onError }: UserSignupPayload, source: SailthruSource): void {
		window.Sailthru.integration('userSignUp', {
			email,
			onSuccess,
			onError,
			source,
			vars: {
				email,
				sign_up_date: new Date().toISOString(),
			},
			lists: { 'Fandom Account Registration - MASTERLIST': 1 },
		});
	}
}

export const sailthru = new Sailthru();
