export function getOverridenPageInfo(nodes, selectedClass, folder, fileName) {
  let replacementHTML = null;
  if (!selectedClass) {
    console.error("No Class Selected, cannot provide overridden page-info");
    return replacementHTML;
  }
  nodes.forEach(node => {
    if (selectedClass) {
      const searchString = `pages/${folder}/${selectedClass}/${fileName}`;
      nodes.forEach(n => {
        if (searchString === n.fields.fileName.relativePath) {
          console.log("FOUND -> ", n.fields.fileName.relativePath);
          replacementHTML = n.html;
        }
      });
    }
  });
  return replacementHTML;
}

/*
 Use to find exercises in class-specific overriden pages
*/
export function getOverridenPageInfoRaw(
  nodes,
  selectedClass,
  folder,
  fileName
) {
  let replacementHTML = null;
  if (!selectedClass) {
    console.error("No Class Selected, cannot provide overridden page-info");
    return replacementHTML;
  }
  //Check whether folder has a sub-folder named as a class name (a,b,c,..) and contains a file with the same name
  const searchString = `pages/${folder}/${selectedClass}/${fileName}`;
  nodes.forEach(n => {
    if (searchString === n.fields.fileName.relativePath) {
      //console.log("FOUND -> ", n.fields.fileName.relativePath,searchString);
      replacementHTML = n.rawMarkdownBody;
    }
  });
  return replacementHTML;
}
