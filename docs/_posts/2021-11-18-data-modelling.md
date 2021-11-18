---
title: Data Modelling
layout: post
categories: [development]
tags: [data, modelling]
---
For anyone that's worked in software development before, you will know that
getting the data right will make or break your application. When you get your
data models correct, it's smooth sailing. Feature development is easy. Data
migration is a breeze. Best of all, future maintainers can see exactly what you
woere thinking and know exactly where to put new things. When the data is wrong,
it's a nightmare. Feture development takes forever and consists more of
refactoring than it does of actual development.

For this reason, I am taking my time at the beginning of the project to map put
as much of the data as I possibly can. For this project, we are in the unique
position of knowing exactly what all of the desired features are and how they
relate to one another. This theoretically makes the data modelling process much
easier. It also however means that the planning process takes more time.

I have begin to add some initial data to the application by re-creating the
overview page. This is an intersting place to start as in includes a lot of the
data required to develop the rest of the game. Once the overview page is
complete and the data appears to be stored ina  sensible way. I should have a
much easier time of re-creating the rest of the application.

## An interesting example

For an example of the considerations I am making, one of the biggest parts of
the game is the idea that players have an army. This army consists of
potentially different units. Each unit could be at different levels.

The first three offensive units are (For the Undead at least):

* Soldier
* Knight
* Berserker

There are several approaches one could take for storing the details of how many
units a player has for each of these types.

### Option 1 - Columns on the User table

This is one of the simplest approaches. The user table has a column for each of
the different unit types. Whenever the player trains (or untrains) a unit, the
appropriate colums is updated. We can then have a property for each of these
units on the user model and go from there. The issue with this approach is that
as we add more units, database migrations are required. This is less than ideal
as updating the database is an extra layer of complexity.

It's also true that the database table would be much alrger, full of columns
that are only helpful when the data is aggregated. Querying the database would
be rather painful too, especially if we are naming columns that we want
returned.

### Option 2 - A join table

We could create a table that links the user to the unit. Each unit type would be
a row in the database. Whenever we need to lookup the army of the player, we
would query all of the army rows for the user and deal with the data
appropriately. This is a bit more complex, but it's much easier to manage.
compared to option 1. One of the biggest benefits to an approach like this is
that the number of unit tyypes that we can have is not limited and adding new
units in the future would not require adding new columns to the database.

### Option 3 - JSON data on the user row

The approach of Option 2 is powerful, mostly because of it's extensibility.
However, having an extra table is an additional burden that we may not need.
A user's army data is not relevant at all without the user itself. The only
tangible benefit that we may receive from the approach of option 2 is that we
could easily query total number of unit types across all players.

Considering that a users army is only relevant in the context for the army
itself, we can simplify option 2 by storing it in a JSON field on the user row.
Whenever we need to update the army of a user, we would simply replace the
entire army object with a new one that has the updated data.

### So what option do I think woulf be best?

At the moment, Option 3 is the best in my opinion. It's the simplest, and
affords enough flexibility to grow over time. Heres a quick example of the sort
of data I think to store.

```javascript
units: [
  { unitType: 'CITIZEN', quantity: 1 },
  { unitType: 'WORKER',  quantity: 2 },
  { unitType: 'OFFENSE', quantity: 3, unitLevel: 1 },
  { unitType: 'DEFENSE', quantity: 4, unitLevel: 1 },
  { unitType: 'SPY',     quantity: 5, unitLevel: 1 },
  { unitType: 'SENTRY',  quantity: 6, unitLevel: 1 }
],
```
