//import React from "react";
import { graphql } from "gatsby";
import createLinkPage from "../helpers/link_helper";

export default createLinkPage("<!--exercises_begin-->","<!--exercises_end-->","Exercises-all",false);

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
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
          }
        }
      }
    }
  }
`;
