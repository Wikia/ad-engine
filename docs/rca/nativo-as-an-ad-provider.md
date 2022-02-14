# Nativo as an ad provider

Date: 2022-02-09

## Status

- proposed

## Context

Nativo is our partner that offers us a native ad solution to be integrated with our ad-stack. From a code perspective it's a JavaScript SDK that calls their servers and renders an ad on our page in more native look&feel in comparison to regular ads. It is separated from Google Ad Manager (our main ad server) but it has an option to integrate it via GAM.

In 2021 we weren't sure if we wanted to invest more into Nativo integration and we implemented the integration as an ad-service: basically one class that loads the SDK, keeps the business logic and connects it with the AdEngine parts. The experiment was running for a bit more than a month and proved it was performing well enough (in the business meaning) that we decided not to try out other native ads integrations.

However, within that month or so we learned how much additional logic is needed to keep it cooperating well with the regular slots, premium ad products and Pathfinder. We also planned to introduce internal tracking, lazy-loading of the Nativo's in-content slot and possibly adding more slots of this kind in future. The idea of changing Nativo into a regular ad provider started growing faster in our heads.  

Making it a provider is a bit of a challenge as it means we need to rebuild the core AdEngine. However, changing how it works would help us prepare it for the performance (in the technical meaning) changes as well as for the ad layouts work we planned in this year.  

## Decision

We decide to change Nativo into an ad-provider, so:

1. `src/ad-services/nativo` is removed
2. `platform-slots-context.setup.ts` we have `ntv_ad` and `ntv_feed_ad` slots defined
3. the new slots have `provider` property that points to the new Nativo [ad provider](https://github.com/Wikia/ad-engine/blob/70845ecaf556d650691c84acb21dcf99c60c8263/src/ad-engine/providers/provider.ts)
4. `src/ad-engine/providers/nativo.ts` is created and is responsible for filling in the dedicated slots (`#ntv_ad` and `#ntv_feed_ad` for now)
5. `setupAdStack()` in `src/ad-engine/ad-engine.ts` are changed in the way that if a slot has provider defined it uses it and fallbacks to GPT provider otherwise

## Consequences

This way it should be easier in the future to integrate/swap slots from regular filled by GPT provider and Nativo. Since Nativo slots are configured as a regular slots, they've got `AdSlot` representation and are registered in `slotService` it should be easier to add logic that allows/blocks them to be filled. The internal tracking should work out of the box.

The challenge is the unknown that will stop working after changing AdEngine's core but we've got our automated e2e tests for help.

We'll also still need to [connect it with Pathfinder](https://github.com/Wikia/silver-surfer/pull/781/files) but here we'll base on the `communicationService` events.

As a follow-up we'll need also to discuss and most likely change how the internal tracking works. Some of the columns we have in the `adengadinfo` just don't make sense for other providers. Most likely we'll also have a better understanding and come up with a plan of refactoring other existing pieces of the AdEngine like `AdSlot`, `slotService`, `slotInjector`, `placeholderService` the pipelines etc.
