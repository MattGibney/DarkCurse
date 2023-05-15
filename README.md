# Dark Curse

This project is an open source re-creation of the once popular MMO Dark Throne.
The name Dark Curse originally belonged to another game from the same company
Lazarus Software. I never had the pleasure of playing that game, but as far as I
can tell, it's basically the same as DarkThrone with a different theme.

So, why purposefully name the project Dark Curse, and not DarkThrone? It's
certainly a little confusing but I picked this for two main reasons. Firstly,
Dark Curse was never as popular and so is not as well known. Secondly, at the
time of writing DarkThrone itself is still live and playable (sort of). Finally,
Dark Throne is the name of a Norwegian metal band and they play havoc with the
SEO.

## Quick Start

In order to get the development environment up and running you need the
following:

* NodeJs (v16.x)
* NPM (v8.x)

Follow the instructions below to download the code, install dependancies, setup and update your database and run the server.

```bash
git clone git@github.com:Moppler/DarkCurse.git
cd DarkCurse
npm install
cat .env-sample > .env
```
setup your postgresql database and get the URI
update the `.env` file with the database URI (and other values as necessary)

```
npm run migrate
npm start
```

## Project scope

Over time, I fully intend to re-create as much of the original game as I can.
This will be a slow process, but I am hopeful that as the project gains
momentum, It will gain additional contributors. The plan is to re-create the
game, fully open source and free-to-play.

I'd like to stick closely to the
original features and play style without being fully strict on things like the
visuals. It would be pretty easy to re-create the original UI but there are
several issues with the UI when compared to modern web applications. Namely, I'd
like to address two critical areas that are lacking in the original game,
Assessibility and Responsiveness. Both of these will be core considerations for
the project and will always be considered.

## Development approach

I intend to run this project as I would any other development project within my
professional career. While this is likely to be a pretty massive overhead for a
project with a single developer, I hope that it can serve as an example to all
developers of how projects like this are handled in a professional environment.
I will do my best to ensure that I explain things as I go and will also try to
keep a development blog up-to-date as I go.

I will go into detail of the application architecture in detail over the course
of the application development cycle. I don't have everything planned out in my
head just yet, but I do have some pretty solid ideas on how I would like to
approach the major problems, so there isn't really a concern over building the
game.

I have extensive experience building large scale applications that serve
millions fo requests a day. I intend to bring that experience to the project and
while my primary focus will not be scale, I will be very careful to ensure that
the application I write will always have the potential to scale. I will also do
my best to document this as I go so that future maintainers can understand my
thoughts when dealing with code in the future.

## Initial thoughts on tech stack

(Backend) Typescript - While not the fastest, NodeJs and Typescript are
incredibly powerful languages with an incredibly rich eco-system of libraries.
It's a language that I really enjoy working with. There are always other options
that one could choose for the job, but this is the one I'm most comfortable with
and if I have any hopes of making something useful from this project, I need to
maximise on the skills I already have.

(Database) PostgreSQL - While there are a lot of potential benefits to a NoSQL
solution for storage, especially within games. I'm reasonalby confident that for
this particular project, PostgreSQL is the best choice. The data structures that
I am thinking about benefit from the relational nature of an SQL database. It's
also the case that I am a big fan of SQL databases and so I am also sticking
with what I know best. As part of my development approach, I will try to keep a
separation of code that should allow for relatively painless swithing of
persistence layer, should the need arise.

(Frontend) Handlebars - Handlebars is a templating language that I've used a
lot over the years. While there are plenty of other options, such as React or
EmberJs. The application I am building has no real need for anything fancy that
comes from a "modern frontend". Just because it's a shiny piece of tech, doesn't
mean we have to use it. I have no issue with the use of modern frameworks, but
I also like to keep things simple. So, I'm going to stick with Handlebars, for
now.
