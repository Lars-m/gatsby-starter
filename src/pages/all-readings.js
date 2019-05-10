//import React from "react";
import { graphql } from "gatsby";
import createLinkSection from "../helpers/linkCollector";
import React from "react";
import Layout from "../components/layout"

export default ({ data }) => {
  console.log(data)
  const links = createLinkSection(data,"<!--readings_begin-->","<!--readings_end-->", "All readings", true);
  return (

    <Layout>
     
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
          date
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
