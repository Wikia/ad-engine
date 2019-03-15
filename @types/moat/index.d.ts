interface MoatPrebidApi {
	getMoatTargetingForPage: () => {
		m_data?: number | string;
	};
}

type MoatYieldReady = () => void;

interface MoatJWAddPayload {
	adImpressionEvent: any;
	partnerCode: string;
	player: any;
}
interface MoatJW {
	add: (payload: MoatJWAddPayload) => void;
}
