# Tracking in Kibana

Date: 2022-03-22

## Status

- accepted

## Context

In 2020 Google started blocking heavy ads and we added a simple service in the AdEngine that sends POSTs with additional debugging information. I wanted to reuse this feature in order to monitor Audigent's segments release but it turned out the info messages aren't being logged to Kibana on production anymore.

In this ADR I propose a change, so the heavy ads incidents as well as sampled Audigent segments will get logged in Kibana.

Useful links:

- [our simple method to send data to ELK](https://github.com/Wikia/unified-platform/blob/259115171fe237ba24bfafbfa2dcc389e14c8204/extensions/fandom/AdEngine/AdEngineController.php#L6-L21),
- [heavy ads logging added in 2020](https://github.com/Wikia/ad-engine/blob/ad132d9bc8120870b88f48d00d6ad17f85a470e6/src/ad-engine/tracking/intervention-tracker.ts#L41-L46)
- [Audigent segments logging](https://github.com/Wikia/ad-engine/pull/1309/files#diff-098480467b4837d1c9442a16d857e8fbdf9fd83d670cc92bbc3c0bb1c5b415c0R72-R75)
- [Kibana dashboard for Audigent](https://kibana.wikia-inc.com/goto/e4789db40a759338da9e3bfe9868a409)
- [Kibana dashboard for Heavy Ads](https://kibana.wikia-inc.com/goto/a1b3c0fe7a5f6abea546e2f05eba0c6d)
- [Kibana dashboard for AdEngine log](https://kibana.wikia-inc.com/goto/a58b370bc987c033372d2ec5647a98cc)

Additionally, we could use [Debug](https://github.com/Wikia/unified-platform/blob/ada8bd1a4f3de1a57dd468f1c99c0202965cbfaa/config/variables-expansions.php#L323-L324) channel in MediaWiki for any ad-hoc debugging. It will require extending functionality of `AdEngineController` and `external-logger.ts` with one more `debug()` method that could send data to the mentioned channel.

## Decision

Define a new logstash index for `AdEngineController` in [variables-expansions.php](https://github.com/Wikia/unified-platform/blob/ada8bd1a4f3de1a57dd468f1c99c0202965cbfaa/config/variables-expansions.php#L316) and set its default logging level to `LogLevel::INFO` in [variables-expansions.php](https://github.com/Wikia/unified-platform/blob/ada8bd1a4f3de1a57dd468f1c99c0202965cbfaa/config/variables-expansions.php#L292).

## Consequences

We will have almost real-time visibility on heavy ads served on our pages and how many segments are being added per user (if sampling is enabled).
