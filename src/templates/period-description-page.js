import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
//import { node } from "prop-types";
import all from "../helpers/periodLinks";
import goals from "../../images/goals.png";
const periodLinks = all.periodLinks;

function getDayInWeekFromDkDate(date) {
  if(date === null || !date.includes("-")){
   throw new Error("Date is NULL")
  }
  const dp = date.split("-");
  const dayInWeek = new Date(dp[2], dp[1] - 1, dp[0]).getDay();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  return days[dayInWeek];
}

export default ({ data }) => {
  const post = data.markdownRemark;
  const slug = data.markdownRemark.fields.slug;
  let links = [];
  let periodInfoHtml = null;
  let periodTitle = null;
  const sorted = periodLinks(data.allMarkdownRemark.nodes, slug);
  //CHECK THIS
  periodInfoHtml = post.html;
  periodTitle = post.frontmatter.periodTitle;
  links = sorted.map((day, index) => {
    const dayInWeek = getDayInWeekFromDkDate(day.frontmatter.date);
    return (
      <tr key={index}>
        <td style={{ width: 100 }}>
          <Link
            style={{ fontSize: "larger", textDecoration: "none" }}
            to={day.fields.slug}
          >
            <span id={day.fields.slug.split("/")[1]}>{dayInWeek}</span>
          </Link>
          <br />
          {day.frontmatter.date}
        </td>
        <td>{day.frontmatter.pageintro}</td>
      </tr>
    );
  });

  return (
    <Layout>
      <div>
        <div
          style={{
            backgroundColor: "#295683",
            borderRadius: 5,
            color: "white",
            padding: 16,
            paddingTop: 1,
            paddingBottom: 0
          }}
        >
          <h1>{periodTitle}</h1>
          <div dangerouslySetInnerHTML={{ __html: periodInfoHtml }} />
          {/* <a href={post.frontmatter.learningGoals}>
            Learning Goals-{periodTitle}
          </a> */}
         {post.frontmatter.learningGoals && (<a href={post.frontmatter.learningGoals} target="_blank" rel="noopener noreferrer">
            <img style={{width:75,float:"left"}} src={goals} alt="Learning Goals-{periodTitle}" />
            <p style={{color:"wheat"}}>Learning Goals-{periodTitle}</p>
         </a>)}
         {!post.frontmatter.learningGoals && (<br/>)}
        </div>
        {links.length > 0 && (
          <table>
            <tbody>{links}</tbody>
          </table>
        )}
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
        isSubPeriodDescription
        isPeriodDescription
      }
      frontmatter {
        periodTitle
        title
        period
        date
        pageintro
        headertext
        learningGoals
      }
    }
    allMarkdownRemark {
      nodes {
          html
          frontmatter {
            title
            period
            periodTitle
            date
            pageintro
            learningGoals
          }
          fields {
            slug
            inFolder
            isIndex
            depth
            isSinglePageDocument
            isPeriodDescription
            isSubPeriodDescription
            shortTitle
            belongsToPeriod
            parentFolder
          }
        }
      }
    
  }
`;
