---
title: An Express Start
layout: post
categories: [blog/development]
tags: [express, node, development]
---
When starting a new application. It's important to make an informed decision
about which application framework to use. Not using one would add a lot of
additional development for no reason. Accepting that one *should* be used, which
one to pick?

There are plenty of options, some that have been around for a long time, others
that are much newer. I've chosen [Express](https://expressjs.com/), something
which has almost become expected at this point. At this point it's pretty boring
but express offers two really important benefits. Firstly, it's got an extensive
list of available middleware, which means you can use it to add functionality
without additional development cost. Secondly, there are hundereds of examples
on the internet, which means you can use it to learn from. I want this project
to be simple for future maintainers to contribute to. For this, I need the
application to be as easy as possible to pick up and start working on.

## `app.ts` and `server.ts`

It may appear redundant, especially if you are following this project from early
on, to have two files. However, this separation is very important. The `app.ts`
file contains the application logic, and the `server.ts` file contains the code
required to actually run the application. This separation is very important, as
it allows us to easily run the application in a testing environment. We can
instantiate an instance of the application without starting the server, and
then perform tests on the server using something like
[supertest](https://github.com/visionmedia/supertest).

I am electing to not add tests just yet, as there isn't really anything to
actually test. For this reason, it may seen a little redundant to write the
application as if I were to add tests. I want to cement the idea from the very
genesis of this project that automated testing is a core tennant. Wherever
possible, I intend to write the code to be as testable as possible. This will,
at times, mean having more code than seems required. But in the long run, it
will be a huge help.
