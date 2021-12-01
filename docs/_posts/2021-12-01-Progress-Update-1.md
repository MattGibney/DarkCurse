---
title: "Progress Update #1"
author: "Moppler"
date: "2021-12-01"
---
Time for my first progress update. I'm starting by trying to make sure I get the
data storage implemented in the best way I can. It would be pretty easy to store
data withouth much thought and planning, but with projects like this, especially
when starting from scratch, it's important to get the data right.

If I make a code change and things don't work out, I can easily roll back or
patch to fix the problem. This isn't the same for databases. If there's a bad
change, fixing it is a lot of work, worst case scenario, it's a rollback; no one
likes a roll back. So, I'm taking my time to ensure that I'm happy with the way
data is being stored. As part of this, I am working on adding pages which expose
key functionality first.

### The Overview

Probably the most important page, it's a dashboard which shows the current
status of your account. Here you get all of the most important information at
once. Having to display such a wide range of information exposed a number of
interesting challenges to consider when designing the database.. If you are
following along with the code, take a look at how the different units are
stored. Civilians, Workers, and the offensive units are all important parts of
the game. I wanted a way to store them that was flexible enough to expand in the
future as well as to allow for easy access to the data when we need to calculate
things like attack strength.

![Overview Screenshot](/assets/progress-update-1/overview.png)

### Training Units

Training units exposes a number of interesting challenges. The first is that we
need to validate that the number of units that the player wants to train are
available citizens. Then we validate that the player has enough money to train
these citizens. So far, so simple.

Next, there is the fact that some units are only available after upgrades have
been purchased. We need to ensure that the user has purchased the upgrade before
we can allow them to train those units.

Finally, some units can be un-trained and become citizens again. This feature
exists mostly for the early game as a way of allowing players to try out
different play styles but there are some situations where it would be beneficial
to re-train units for specific situations. A player could re-spec their army
depending on the desired outcome. The trade off there being that only low-level
units can be un-trained so players working with this approach can only alter
their different strengths so much.

![Training Screenshot](/assets/progress-update-1/training.png)

### A quick note on visuals

At the moment, my primary focus is on making things that are functional. I'm
specifically trying to keep the UI as simple as possible. It's my intention,
longer term, to have different themes just like Dark Throne had. For now, please
don't pay too much attention to the aesthetics. I promise that i'll make things
pretty when the functionality has matured.

### Get in touch

If you would like to chat about this project, I have set up a
[Discord Server](https://discord.gg/BCrdJSpXWg) for us to use. I encourage
everyone to join the server and get to know each other. I'd love for you all to
be part of the conversation.
