---
title: "Progress Update #2"
author: "Moppler"
date: "2021-12-18"
---
It's time for another progress update. I'm making slow and steady progress,
things can sometimes feel like they are progressing slowly, especially when
there are days where I can't put any time into the project. But It's important
to always remember that this is a marathon, not a sprint.

It sounds like there are a couple of developers working on making replacements
to Dark Throne. This is great, It seems like two different approaches are being
taken with these projects. The first is a full re-write, similar to this
project. The others are modifying existing games. Both approaches are valid and
there isn't a wrong choice. It depends on what the project goals are.

## Banking

Most of the work I have been putting into Dark Curse recently has been related
to banking providing players with a way to securely store their gold in the bank
to protect it from plunder. I have the core functionality implemented now, all
that's left to add is the logging. This is commonly called a ledger and it works
the same way as a bank statement. We record the incoming and outgoing
Gold. Where it came from and where it is going to. I have been spending a lot of
time thinking about the best way to structi=ure this data as it's non-trivial.

One of the biggest considerations is that in Dark Throne, the player has two
pots of Gold. Their `Gold on Hand`, and the `Gold in Bank`. Bringing this back
to the banking analogy, this is t=like the player having two accounts. Because
the player already has two accounts, there is technically no reason that there
can't be more. For example, what if Alliances had a collective fund. Perhaps we
could create a feature in the future that would allow alliances to work together
on a fortification and go to war with each other.

Every time I think I have a plan, I think of some new cool possible feature that
could be added in the future. I've pretty much settled now on what I want to do
for the ledger. I doubt I'll have time over the holiday's to work on this, but
once I have time. I'll get the banking history (ledger) feature added.

## Q&As

I've received some direct messages from some members of the Dark Curse
community on [Discord](https://discord.gg/BCrdJSpXWg). I'd like to take this
opportunity to provide some more clarity on the goals for this project and
ensure that everyone is clear on what we will have at the end.

### Q: Why start from scratch? Wouldn't it be quicker to buy an existing game and modify it?

Buying websites is a very difficult process, domain names are pretty simple but
entire websites are another matter. Buying an existing game would pose several
challenges. Firstly, there is the simple negotiation process. Agreeing on a
price and moving money is a difficult and risky process. There is a lot of good
faith required in this kind of transaction.

Secondly, an existing game has an existing player base. When players sign up to
a website, they agree to several legal contracts, privacy policies, terms of
service etc. Maintaining these legal agreements adds an entirely new layer of
risk to the prospect. This could be avoided by closing the purchased game and
wiping the data. Doing this does remove the legal issue for the existing
players, but now there are two dead games. There is no guarantee the players
will return, nor will the original Dark Throne players join it.

The third issue is again tied to legal. GDPR. There are a lot of Dark Throne
players in Europe who are subject to GDPR. Migrating data without
first seeking the consent of each player will be a breach of GDPR
which brings a very large fine.

### Q: Are you making a complete clone of Dark Throne?

Yes and No. My initial plans are to work towards something functionally
equivalent to Dark Throne. This will mean that everything that previously
existed in Dark Throne will exist in Dark Curse. I am not going to re-create
the exact algorithms that determine XP and Gold rates, but will try to keep
things as close as possible.

My longer-term plans are to add more features and functionality to the base
game. All of these features will be voted on by the community. Players will
have the chance to cast their votes. Iff (if and only if) the feature gets a
majority approval, the feature will be implemented. Players will be regularly
invited to suggest new features and push proposals to the community at large.

### Q: When will I be able to play the game?

This is a passion project for me. I'd love to commit a lot of time to work on
it but the reality is that I have a life outside of the project that comes first
for me. I have a young family and a pretty intense day job, so it can be
difficult to find the time to work on Dark Curse. I'd love to give some kind of
estimate for when the game will be playable but I simply cannot commit enough
time to provide a reliable estimate.

I greatly appreciate your support and interest. If you'd like to help out with
the project, whether it's technical or not, please get in touch! Even if you
just want to provide moral support. I'd love to hear from you.
