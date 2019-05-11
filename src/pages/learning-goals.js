//import React from "react";
import { graphql } from "gatsby";
import createLinkSection from "../helpers/linkCollector";
import React from "react";
import Layout from "../components/layout";
import makeUlForGoals from "../helpers/goalHelper"
import {getDayInWeekFromDkDate} from "../helpers/date_utils"

export default ({ data }) => {
  const goals = data.allLearningGoal.nodes;
  console.log("DATA", data);
  

  const rows = goals.map((r, idx) => {  
    const goals = makeUlForGoals(r);
    let dayInWeek;
    try{
      dayInWeek = getDayInWeekFromDkDate(r.day)
    }catch(err){
      console.log("UPPPS",err)
    }
    console.log(dayInWeek)
    
    return (
      <tr key={idx}>
        <td style={{ width: "10%" }}>
        Week: {r.week}<br/>
        {dayInWeek && (<React.Fragment>{dayInWeek} <br/> </React.Fragment>)}
         {r.day}
        </td>
        <td>
          {goals}
        </td>
      </tr>
    );
  });

  const links = createLinkSection(
    data,
    "<!--exercises_begin-->",
    "<!--exercises_end-->",
    "Exercises-all",
    false
  );
  return (
    <Layout>
      <h2>Learning Goals (Period-1)</h2>
      <table>
        <tbody>{rows}</tbody>
      </table>

      {/* {links} */}
    </Layout>
  );
};

export const query = graphql`
  query {
    
    allLearningGoal {
      nodes {
        id
        day
        week
        period
        goals
      }
    }

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
