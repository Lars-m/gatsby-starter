const START_TAG = "<!--*#*START";
const END = "*#*-->";
const END_TAG = "<!--*#*END";
const SEPARATOR = "_#_";

function indexes(source, find) {
  if (!source || !find) {
    return [];
  }
  var result = [];
  for (i = 0; i < source.length; ++i) {
    if (source.substring(i, i + find.length) == find) {
      result.push(i);
    }
  }
  return result;
}
function findFullTag(source, start, fullPathToNode) {
  let tag = {};
  const stringToCheck = source.substring(start);
  const endTagIndex = stringToCheck.indexOf(END);
  let fullTag = stringToCheck.substring(0, endTagIndex + END.length);
  if (fullTag.indexOf("\n") > -1) {
    throw new Error(
      `Tag must start and end, on the same line ${fullTag}, ${fullPathToNode}`
    );
  }
  let includeFields = fullTag
    .replace(START_TAG, "")
    .replace(END, "")
    .trim();
  tag.fullTag = fullTag;
  tag.includeFields =
    includeFields.indexOf(SEPARATOR) > -1
      ? includeFields.split(SEPARATOR).join(",")
      : includeFields;
  const endIdx = stringToCheck.indexOf(fullTag.replace(START_TAG, END_TAG));
  if (endIdx === -1) {
    throw new Error(`NO matching end-tag found for  ${fullTag}, ${fullPathToNode} 
    (Are the include sections identical, including spaces?)`);
  }
  tag.linkContent = stringToCheck.substring(fullTag.length + 1, endIdx);
  return tag;
}

function findMatchingTags(source,fieldToMatch, fullPathToNode) {
  const tags = [];
  const startIndexes = indexes(source, START_TAG);
  const endIndexes = indexes(source, END_TAG);
  if (startIndexes.length !== endIndexes.length) {
    throw new Error(`Amount of Start and End tags are not equal in ${fullPathToNode}`);
  }
  if (startIndexes.length === 0) {
    return tags;
  }
  startIndexes.forEach(idx => {
    const tag = findFullTag(source,idx,fullPathToNode);
    if(tag.includeFields.includes(fieldToMatch)){
      tags.push(tag);
    }
  })
  return tags;
}

const testString = `
---
title: "Day-2, an introduction to maven"
date: "29-01-2019"
pageintro: |  
  Testing and Maven
---

### Before this lesson you should:

<!--*#*START readings *#*-->
- :book: [What is Maven (5 min.)](https://maven.apache.org/what-is-maven.html)
- :book: [Maven in 5 min (expect to use at least 15 min. This is included in one of todays exercises)](https://maven.apache.org/guides/getting-started/maven-in-five-minutes.html)
- :book: [Maven Getting Started Guide (15-20 min, bookmark for future reference)](https://maven.apache.org/guides/getting-started/index.html)
<!--*#*END readings *#*-->

### Exercises
<!--*#*START exercises *#*-->
- [Getting started with Maven](https://docs.google.com/document/d/193QmOG5RIzCq1oTwMVKlCegWTT8lv7hmavqX6PxMLEM/edit?usp=sharing)
- [Testing With Maven](https://docs.google.com/document/d/1tDz3rP4Li52nJSIqBgPo6PKLSpVtX56a-ygAHKdKNO0/edit?usp=sharing)
<!--*#*END exercises *#*-->

<!--*#*START exercises_#_guides *#*-->
[Maven Guidelines for 3. semester](https://docs.google.com/document/d/1WhUccsbU7SzomqSKau30BcmfsvjBMCNDsWGohFFmyRI/edit)
<!--*#*END exercises_#_guides *#*-->

#### Guidelines
<!--*#*START guides *#*-->
- [Maven Guidelines for 3. semester](https://docs.google.com/document/d/1WhUccsbU7SzomqSKau30BcmfsvjBMCNDsWGohFFmyRI/edit)
<!--*#*END guides *#*-->

#### Slides
<!--*#*START slides *#*-->
[Maven Slides](https://docs.google.com/presentation/d/1o2c2haU7zM9M9U6tRW7drgRMObmWx-9oiCe2_6mPmRk/edit?usp=sharing)
<!--*#*END slides *#*-->

`;

console.log("GUIDES")
console.log(findMatchingTags(testString,"guides","XXX"));
console.log("EXERCISES")
console.log(findMatchingTags(testString,"exercises","XXX"));
console.log("SLIDES")
console.log(findMatchingTags(testString,"slides","XXX"));

// const startIndexes = indexes(testString, START_TAG);
// const endIndexes = indexes(testString, END_TAG);
// if (startIndexes.length === 0) {
//   return;
// }
// if (startIndexes.length !== endIndexes.length) {
//   console.error(
//     "Amount of Start and End tags are not equal in " + node.fileAbsolutePath
//   );
//   return;
// }
// console.log("Start Indexes", startIndexes);
// console.log("End Indexes", endIndexes);

// const firstTag = findFullTag(testString, startIndexes[0]);
// //console.log(firstTag)
// startIndexes.forEach(idx => console.log(findFullTag(testString, idx)));
