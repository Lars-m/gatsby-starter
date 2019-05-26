---
title: "JPA, JPQL and Testing"
date: "SP3 (22-02-2019)"
isSP: true
---

## Part-1 Complete all exercises (according to your colour level) from this week

<!--PeriodExercises period2/week1 PeriodExercises--> 

## Part-2 JPA with CI and Test
As you hopefully have noticed this semester have placed much focus on testing and CI. 
This exercise will introduce the fundamentals of how we expect you to do this, and provide the necessary background 
for the Exam preparation questions that involves testing (first one in part 3).

- [Clone this project](https://github.com/cphdat3sem2019spring/plainJpaTemplate.git), and follow the instructions given in the readme file to make it work, 
both with a local database you must set up, and the in-memory database used for the unit tests.
- Add a few more features to the Facade-class, like (getAllCars, getCarsByMake, getCarById, deleteCarByID etc.), but DO IT the test first way. 
That is Write a test, implement the feature and then continue). Make sure you understand the necessity of setting up well-known data in the database, before each test.
- [#yellow#] Add your project to Github, and make the necessary changes to let Travis control whether it builds and all tests are green.
- [#red#] Add the necessary changes to perform integration tests on Travis using a MySQL database set up by Travis. Important: No info is given in the class related to this topic. Feel free to postpone this part until later in the semester. Info will be given.

## Part 3 Exam Preparation Exercises
<!--BEGIN exam-prep ##-->
- [Exam Preparation Exercise on relations and queries](https://docs.google.com/document/d/1K_7ljFtJCSFLJydyCldjhza2dtP2lJncBQrPtIDFyYE/edit?usp=sharing) *This exercise focuses on JPA, JPQL using a test-first strategy*
- [Exam Preparation Exercise on JPQL](https://docs.google.com/document/d/1bdYbb6ykTdpm8ea0B3CXz3J6kpQZF3bgPc0z4PCqKLc/edit?usp=sharing) *This exercise focuses on JPA, JPQL and mapper classes (DTO’s) which you will need when you start to add a REST-API on top of your database design  (next week)*
- [Object Relational Mapping and Inheritance (Only do this if you REALLY have the time. You won’t risk a question like this)](https://docs.google.com/document/d/1iDJAgxuzKkVmiaElVx4Pcsvhs7_D-R6CYAk8oOeJ52w/edit?usp=sharing) 

<!--END exam-prep ##-->