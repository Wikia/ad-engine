interface AtsAdditionalData {
	consentType?: 'gdpr' | 'ccpa';
	consentString?: string;
	type: 'emailHashes';
	id: [sha1: string, sha256: string, md5: string];
}

interface ATS {
	setAdditionalData: (data: AtsAdditionalData) => void;
}
