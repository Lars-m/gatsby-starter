//import React from "react";
import { graphql } from "gatsby";
import createLinkSection from "../helpers/linkCollector";
import React from "react";
import Layout from "../components/layout"

export default ({ data }) => {
  console.log(data)
  const links = createLinkSection(data,"<!--exercises_begin-->","<!--exercises_end-->","Exercises-all",false);
  return (

    <Layout>
      <h2>Hello World</h2>
       <a href="http://dr.dk" target="_blank">DR</a>
      <h2>CA's</h2>
      <a href="http://dr.dk">DR</a><br/>
      <a href="http://dr.dk">DR</a>
       {links}
       
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
        nodes {
          id
          rawMarkdownBody
          frontmatter {
            title
            
            pageintro
          }
          fields {
            slug
            belongsToPeriod
            shortTitle
          }
        }
      
    }
  }
`;
