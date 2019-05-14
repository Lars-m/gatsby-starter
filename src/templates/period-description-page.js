import React from "react";
import { graphql, Link } from "gatsby";
import Layout from "../components/layout";
import all from "../helpers/periodLinks";
const periodLinks = all.periodLinks;

function getDayInWeekFromDkDate(date) {
  if(date === null || !date.includes("-")){
   throw new Error("Date is NULL")
  }
  const dp = date.split("-");
  const dayInWeek = new Date(dp[2], dp[1] - 1, dp[0]).getDay();
  if(NaN(dayInWeek)){
    return date;
  }
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
  let links = [];
  let periodInfoHtml = null;
  let periodTitle = null;
  const sorted = periodLinks(data.allMarkdownRemark.nodes, data.markdownRemark.fields.inFolder);
  //CHECK THIS
  periodInfoHtml = post.html;
  periodTitle = post.frontmatter.title;
  links = sorted.map((day, index) => {
    let dayInWeek = day.fields.shortTitle;
    try{
      dayInWeek = getDayInWeekFromDkDate(day.fields.shortTitle);
    }catch(err){} 
    return (
      <tr key={index}>
        <td style={{ width: 120 }}>
          <Link
            style={{ textDecoration: "none" }}
            to={day.fields.slug}
          >
            <span id={day.fields.slug.split("/")[1]}>{dayInWeek}</span>
          </Link>
        </td>
        <td>{day.frontmatter.pageintro || day.frontmatter.title}</td>
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
         <br/>
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
        inFolder
        isIndex
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
