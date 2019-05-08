---
title: "An introduction to NoSQL, MongoDB and Mongoose"
period: "Flow-2"
date: "12-03-2019"
pageintro: | 
   A quick intro to NoSQL. We will focus only on document database and more specifically use.

   MongoDB with Mongoose as a layer between your code and the DB (somehow similar to what you know with JPA).

---

### Before this lesson you should:
In order to get a general understanding about NoSQL I recommend that you watch the two videos given in the Read/Watch-section.

The first, and simplest by Maximilian from Academind, provides a quick overview of traditional relational databases compared to Document Databases like MongoDB. If you know your SQL (as you should) you can skip the first 10 minutes and jump right to the NoSQL-part.

The second, and longest, gives a very good general introduction to NoSQL Database, why they were invented, and their Pros & Cons.
I don't plan to talk about NoSQL in general, since _Martin Fowler_ does it a lot better than me. Watch the video , either before or after (or both ;-) the lesson. It covers all "general learning goals" related to NoSQL

**Important:** Normally I would recommend a local database for development. Since however, we only have limited time for this topic, I suggest you create a cloud version of MongoDB from [Atlas, as described here](https://docs.atlas.mongodb.com/getting-started/), BUT SEE hints below first. Use this account for _all exercises_ related to MongoDB and Mongoose. 
- When you get to **step 5** in the getting started guide, enter this value for IP Whitelist: `0.0.0.0/0` to simplify matters (DON'T EVER DO THIS FOR A PRODUCTION DB, and make sure you understand why)
- When you get to part-6, select: *"Connect Your Application"*, :arrow_right: on the next window select `Node.js" and` newest version" for your driver. On the same window, select *Connection String Only" to get a string ready to paste into our code (when you have replaced the values for user, and password with what you have created).

**Make sure you have done this BEFORE the lesson**

### Read/Watch
<!--readings_begin-->
- [:tv: SQL vs NoSQL (15. min, if you skip the parts you should already know)](https://www.youtube.com/watch?v=ZS_kXvOeQ5Y)
- [:tv: Introduction to NoSQL - Martin Fowler (54 min.)](https://www.youtube.com/watch?v=qI_g07C_Q5I)
- [:book: Mongoose Documentation (skim only, BUT BOOKMARK (10-20 min.))](https://mongoosejs.com/docs/guide.html)
<!--readings_end-->
- [:book: Skim my idea for a mini project, meant for the rest of the semester](https://docs.google.com/document/d/15e4a8zho6wdFrBCxYlstGZYlP1wgwjEWM_NYpjcW__0/edit?usp=sharing)

### Exercises
<!--exercises_begin-->
 - [Getting Started with mongoose](https://mongoosejs.com/docs/index.html)
 - [Mongoose Crud Tutorial](https://vegibit.com/mongoose-crud-tutorial/) **READ THIS BEFORE YOU START**: This tutorial assumes you have installed MongoDB locally, but use the [start code provided here](https://github.com/fullstackjavascriptcode/crudMongooseStartCode) to get a quick start, using your account on *MongoDB Atlas* (it also sets up sample data for the queries suggested by the tutorial). The tutorial assumes you have installed a local Mongo Client *Compass* (similar to Workbench for MySQL), but I suggest you just use the UI-environment provided in the cloud by Atlas.
<!--exercises_end-->

### Slides
[Mongo/Mongoose Slides](http://slides.mydemos.dk/noSQL/mongo_mongoose.html#1)



