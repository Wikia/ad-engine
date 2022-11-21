import { context, DiProcess } from '@wikia/ad-engine';

export class GamefaqsTargetingSetup implements DiProcess {
	execute(): Promise<void> | void {
		context.set('targeting', { ...this.getPageLevelTargeting() });
	}

	getPageLevelTargeting() {
		const utagData = window.utag_data;

		const targeting = {
			s0: 'gaming', // TODO: Top level ad unit? utag.siteHier
			rating: undefined, // TODO: ale maja cos takiego, np: "rating=esrb-m,pegi-18,cbau-r,cero-z,gbko-18"
			gnre: utagData.productGenre, // genre=Role-Playing,Action%20RPG
			media: undefined, // TODO: W AdEngine: media=["cards","tv","movies","games","comics","books"] -> U nich nie ma chyba czegos takiego jak 'media, moge sobie to najwyzej powycinac z "utag_data.siteHier"
			pform: utagData.productPlatform,
			pub: undefined, // TODO: W AdEngine: pub=["lucasarts","ea","wbie","activision","disney"] -> U nich franchise? (franchise=cyberpunk-2077)
			theme: undefined, // TODO: W AdEngine: ["alien","villains","morality","roleplay","space","military","monster","heroes","sword","lego","magic","robots"] -> U nich BRAK
			tv: undefined, // TODO: W AdEngine: ["cn","disney"]
			pv: undefined, // TODO: Jest u nich w targetingu ('pv=1') ale nie ma w utag_data
			pvg: undefined, // TODO: Crossproperty pageview targeting (??)
			session: undefined, //  TODO 'session targeting' - Czy to jest już 'pvg' zdefiniowany wyżej??
			// KEYVALS NOT ADDED BY SEBA THAT I THINK WILL BE USEFUL
			s0c: undefined, // defined in 'm_categories'
		};

		return targeting;
	}
}
