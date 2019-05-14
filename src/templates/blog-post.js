import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
//import all from "../helpers/periodLinks";
import "../../style.css";
import makeUlForGoals from "../helpers/goalHelper";

//To Style (add line breaks) frontmatter
// Uses example from here: https://github.com/gatsbyjs/gatsby/issues/5021
import remark from "remark";
import recommended from "remark-preset-lint-recommended";
import remarkHtml from "remark-html";

export default ({ data }) => {
  const post = data.markdownRemark;
  const learningGoal = data.learningGoal;
  console.log("GOAL", learningGoal);
  let title = post.frontmatter.title;
  let periodInfoHtml = null;
  let periodTitle = null;
  //let belongsToPeriod = post.fields.belongsToPeriod;
  let folder = post.fields.inFolder;
  console.log("BELONGS", folder === post.fields.belongsToPeriod);
  console.log("SLUG", post.fields.slug);
  const nodes = data.allMarkdownRemark.nodes;
  console.log("TYPE", nodes);
  nodes.forEach(e => {
    if (e.fields.isIndex) {
      periodTitle = e.frontmatter.title;
      periodInfoHtml = e.html;
    }
  });

  if (post.frontmatter.period && post.frontmatter.date) {
    title = `${title} (${post.frontmatter.date})`;
  }

  const pageInfo = post.frontmatter.pageintro
    ? remark()
        .use(recommended)
        .use(remarkHtml)
        .processSync(post.frontmatter.pageintro)
        .toString()
    : "";
  const goals = learningGoal ? (
    <React.Fragment>
      <h3 style={{ color: "#295683" }}>After this lesson you should:</h3>
      {makeUlForGoals(learningGoal)}
    </React.Fragment>
  ) : (
    ""
  );

  return (
    <Layout>
      <div>
        {periodInfoHtml && (
          <div className="period-info">
            <h1>##xx##{periodTitle}</h1>
            <div dangerouslySetInnerHTML={{ __html: periodInfoHtml }} />
          </div>
        )}
        <h2 style={{ color: "#295683" }}>{title} </h2>
        <div
          style={{ fontStyle: "italic", padding: 2, color: "darkgreen" }}
          dangerouslySetInnerHTML={{ __html: pageInfo }}
        />
        <div> {goals}</div>

        <div dangerouslySetInnerHTML={{ __html: post.html }} />
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($slug: String!, $shortTitle: String!) {
    learningGoal(day: { eq: $shortTitle }) {
      id
      day
      week
      period
      goals
    }

    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      fields {
        slug
        belongsToPeriod
        shortTitle
        inFolder
      }
      frontmatter {
        
        title
        period
        date
        pageintro
        headertext
      }
    }
    allMarkdownRemark {
      nodes {
        html
        frontmatter {
          title
          period
        
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
`;
