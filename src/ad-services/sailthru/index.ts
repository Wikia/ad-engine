export interface UserSignupPayload {
	email: string;
	onSuccess: () => void;
	onError: () => void;
}

export type SailthruSource = 'adengine_in_content_ad';

class Sailthru {
	isLoaded(): boolean {
		return !!window.Sailthru;
	}

	userSignup(payload: UserSignupPayload, source: string): void {
		const { email, onSuccess, onError } = payload;

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
