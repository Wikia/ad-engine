# Ad unit for LIS (Layout Initializer requeSt)

Date: 2022-03-11

## Status

What is the status, such as:

- proposed

## Context

In [the proof of concept](https://github.com/Wikia/ad-engine/pull/1286) we implemented LIS (Layout Initializer Slot) and by doing this [we proved ad loading time increase](https://fandom.atlassian.net/browse/ADEN-11434?focusedCommentId=565738) for the Fan Takeover campaigns served like that.

In the follow-up code refactoring we keep using [the tagless request](https://support.google.com/admanager/answer/2623168?hl=en) but we decoupled LIS with a slot loosing with it full MEGA ad unit string and instead of `/5441/wka1b.LIS/layout_initializer/desktop/ucp_desktop-fandom-article-ic/_top1k_wiki-life` or `/5441/wka1b.LIS/layout_initializer/desktop/ucp_mobile-fandom-article-ic/_top1k_wiki-life` we now have `/5441/wka1b.LIS/layout_initializer/`.

## Decision

I propose leave the hard-coded ad unit for LIS until we finish testing it and pass it to AdOps.

Ad units are mostly used for reporting about real slot performance whereas LIS is a a tagless request (Layout Initializer requeSt). Unless we get a clear requirement from RevOrg to make it's ad unit string more flexible I'd leave it as-is.

## Consequences

Filtering reports about requests sent via LIS will not be possible. We'll have only information about how many LIS requests there were sent to GAM but we won't be able to tell if they were sent from a specific MediaWiki skin (`ucp_desktop`/`ucp_mobile`), host (`fandom`/`gamepedia`), page type (`article-ic`/`fv-article`/`wv-article`) or vertical.

If at some point Fandom decides we should have this reporting capabilities for LIS we could use `stringBuilder.build()` pass to it default ad unit from the basic ad context with proper parameters. It may work if in the setup steps before `AdLayoutInitializerSetup` we set everything we need in the targeting.
