import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
//import all from "../helpers/periodLinks";
import  "../../style.css";


//To Style (add line breaks) frontmatter
// Uses example from here: https://github.com/gatsbyjs/gatsby/issues/5021
import remark from "remark";
import recommended from "remark-preset-lint-recommended";
import remarkHtml from "remark-html";

export default ({ data }) => {
  const post = data.markdownRemark;
  let title = post.frontmatter.title;
  let periodInfoHtml = null;
  let periodTitle = null;
  let belongsToPeriod = post.fields.belongsToPeriod;
  console.log("BELONGS",belongsToPeriod)
  console.log("SLUG",post.fields.slug)
  const edges = data.allMarkdownRemark.edges;
  edges.forEach(e => {
    if (e.node.fields.isPeriodDescription === belongsToPeriod ) {  
      periodTitle = e.node.frontmatter.periodTitle;
      periodInfoHtml = e.node.html;
    }
  });

  if (post.frontmatter.period && post.frontmatter.date) {
    title = `${title} (${post.frontmatter.date})`;
  }

  const  pageInfo = post.frontmatter.pageintro
      ? remark()
          .use(recommended)
          .use(remarkHtml)
          .processSync(post.frontmatter.pageintro)
          .toString()
      : "";
  
  return (
    <Layout>
      <div>
        {periodInfoHtml && (
          <div className="period-info"       >
            <h1>{periodTitle}</h1>
            <div dangerouslySetInnerHTML={{ __html: periodInfoHtml }} />
          </div>
        )}
        <h2 style={{color:"#295683"}}>{title} </h2>
        <div
          style={{ fontStyle: "italic", padding: 8, color: "darkgreen" }}
          dangerouslySetInnerHTML={{ __html: pageInfo }}
        />
        <div dangerouslySetInnerHTML={{ __html: post.html }} />

      </div>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
        belongsToPeriod
        
      }
      frontmatter {
        periodTitle
        title
        period
        date
        pageintro
        headertext
      }
    }
    allMarkdownRemark {
      edges {
        node {
          html
          frontmatter {
            title
            period
            periodTitle
            date
            pageintro
          }
          fields {
            slug
            belongsToPeriod
            isPeriodDescription
            
          }
        }
      }
    }
  }
`;
