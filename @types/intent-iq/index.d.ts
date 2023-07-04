/**
 * IntentIQ configuration object.
 *
 * @see: https://prebid-rtb.documents.intentiq.com/integration/iiq-js-integration
 */
interface IntentIQConfig {
	partner: number;
	pbjs?: Pbjs;
	timeoutInMillis?: number;
	ABTestingConfigurationSource?: string;
	abPercentage?: number;
	manualWinReportEnabled?: boolean;
	partnerClientId?: string;
	partnerClientIdType?: number;
	callback?: (data: any) => void;
	browserBlackList?: string;
	domainName?: string;
}

/**
 * IntentIQ report data object.
 *
 * @see: https://prebid-rtb.documents.intentiq.com/integration/getting-started-with-rtpo-win-report
 */
interface IntentIQReportData {
	biddingPlatformId: number;
	partnerAuctionId?: string;
	bidderCode: string;
	prebidAuctionId?: string;
	cpm: number;
	currency: string;
	originalCpm?: number;
	originalCurrency?: string;
	status?: string;
	placementId?: string;
}

type IntentIqObject = {
	new (config: IntentIQConfig): IntentIqObject;
	reportExternalWin(data: IntentIQReportData): void;
	intentIqConfig?: {
		abTesting?: {
			currentTestGroup: string;
		};
	};
	getIntentIqData?: () => string;
};
