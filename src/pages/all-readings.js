//import React from "react";
import { graphql } from "gatsby";
import createLinkPage from "../helpers/link_helper";

export default createLinkPage(
  "<!--readings_begin-->",
  "<!--readings_end-->",
  "All readings",
  true
);

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
        }
      }
    }
  }
`;
