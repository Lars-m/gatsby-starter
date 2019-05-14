const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` });
    
    //const idx = node.fileAbsolutePath.indexOf("/pages")+"/pages".length;
    const idx = node.fileAbsolutePath.indexOf("/pages")+"/pages/".length;
    const relevantPath = node.fileAbsolutePath.substring(idx);
    const fileParts = relevantPath.split("/");
    const isIndex = fileParts[fileParts.length-1]==="index.md";
    const fileName = fileParts[fileParts.length-1];
    
    //const folderName = fileParts[fileParts.length-2];
    const fileNameStarts = relevantPath.lastIndexOf("/");
    const folderName = relevantPath.substring(0,fileNameStarts)//+1); 
    
  
    const partsFromFullPath = node.fileAbsolutePath.split("/");
    //const parentFolder = fileParts.length >3 ? fileParts[fileParts.length-3] : null ;
    const folderIndex = folderName.lastIndexOf("/");
    const parentFolder = folderName.substring(0,folderIndex);
    const depth = fileParts.length-1;

    console.log("FOLDER",folderName,`(${fileParts[fileParts.length-1]})`,`(${relevantPath})`)
    console.log("Parent",parentFolder,`Depth: ${depth}`)
    
    
    const parts = slug.split("/");
    //Always include the slug
    createNodeField({
      node,
      name: `slug`,
      value: slug
    });
     /*
     Rules:
     For plain md-files
     if frontMatter has a date this is used as shortTitle otherwise it must include a shortTitle 
     if shortTitle is set from a date, the node will get a shortTitleIsDate=date;
     For index.md files
     if frontMatter has a shortTitle it will be used as short title, if not the folder name will be used
     */
    
    if(!isIndex && !( node.frontmatter.date || node.frontmatter.shortTitle)){
      //throw new Error(`${node.fileAbsolutePath} must include a date and/or a shortTitle in its frontmatter`)
    }

    const title = node.frontmatter.title ? node.frontmatter.title : `${fileName} (no title provide in md)`
      
  
    
    let shortTittle;
    if(isIndex){
       shortTitle = node.frontmatter.shortTitle ? node.frontmatter.shortTitle : folderName
    } else{
      shortTitle = node.frontmatter.date ? node.frontmatter.date : node.frontmatter.shortTitle;
    }
    if(shortTitle == null){
      shortTitle = fileName;
    }
    if(shortTitle){
      createNodeField({
        node,
        name: `shortTitle`,
        value: shortTitle
      });
    }
    
    createNodeField({node, name:"title",value: title })
    createNodeField({node, name:"fileName",value: fileName })
    createNodeField({node, name:"inFolder",value: folderName })
    createNodeField({node, name: `isIndex`,value: isIndex});
    createNodeField({node, name: `depth`,value: depth});
    createNodeField({node, name: `parentFolder`,value: parentFolder});

    if (parts.length > 4 && node.fileAbsolutePath.includes("/index.md")) {
      throw new Error("Periods can only have sub-periods one level down")
    }
    if (parts.length === 3 && node.fileAbsolutePath.includes("/index.md")) {
      console.log("isPeriodDescription",slug)
      createNodeField({
        node,
        name: `isPeriodDescription`,
        value: parts[1]
      });
      
    }

    if (parts.length === 4 && node.fileAbsolutePath.includes("/index.md")) {
      console.log("isSubPeriodDescription",slug)
      return createNodeField({
        node,
        name: `isSubPeriodDescription`,
        value: parts[2],
        parent: parts[1]
      });
    }

    if (parts.length > 3) {

      createNodeField({
        node,
        name: `belongsToPeriod`,
        value: parts[1]
      });
      return 
    }

    if (node.frontmatter.headertext) {
      createNodeField({
        node,
        name: `isSinglePageDocument`,
        value: true
      });
    }
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              fields {
                slug
                isSinglePageDocument
                isPeriodDescription
                isSubPeriodDescription
                belongsToPeriod
                shortTitle
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        
        let template = `./src/templates/blog-post.js`; //fallback
        if (node.fields.isPeriodDescription){
          template = `./src/templates/period-description-page.js`
        }
        else if (node.fields.isSubPeriodDescription){
          template = `./src/templates/period-description-page.js`
        }
        else if (node.fields.belongsToPeriod){
          template = `./src/templates/blog-post.js`
        }
        else if(node.fields.belongsToPeriod){
          template = `./src/templates/blog-post.js`;
        }
        if (node.fields.isSinglePageDocument) {
          createPage({
            path: node.fields.slug,
            component: path.resolve(`./src/templates/single-page.js`),
            context: {
              // Data passed to context is available in page queries as GraphQL variables.
              slug: node.fields.slug,
              isSinglePageDocument:node.fields.isSinglePageDocument
            }
          });
        } 
        else  {
          createPage({
            path: node.fields.slug,
            component: path.resolve(template),
            context: {// Data passed to context is available in page queries as GraphQL variables.
              slug: node.fields.slug,   
              shortTitle: node.fields.shortTitle,
            }
          });
        } 
      });
      resolve();
    });
  });
};
