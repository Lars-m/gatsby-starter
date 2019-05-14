import React from "react"
import { css } from "react-emotion"
import { Link, graphql } from "gatsby"
import { rhythm } from "../utils/typography"
import Layout from "../components/layout"
import { getDayInWeekFromDkDate, getDateFromDkDate } from "../helpers/date_utils"

function getDateForTitleIfDate(shortTitle){
  let dayInWeek = "";
  console.log("Short",shortTitle)
  try{
     dayInWeek = ` (${getDayInWeekFromDkDate(shortTitle)})`
     console.log(dayInWeek)
  }catch(err){}
  return shortTitle + dayInWeek
}
export default ({ data }) => {
  let days = data.allMarkdownRemark.edges.filter(({ node }) => node.fields.belongsToPeriod);
  days = days.map(d=>{
    const node = d.node;    
    //const dateForTitle = `${node.frontmatter.date} (${getDayInWeekFromDkDate(node.frontmatter.date)})`
    const dateForTitle = getDateForTitleIfDate(node.fields.shortTitle);
    return {
      title: `${dateForTitle} - ${node.frontmatter.title}`,
      sortField: getDateFromDkDate(node.fields.shortTitle).toString().toLowerCase(),
                 
      id: node.id,
      info: node.frontmatter.pageintro,
      slug: node.fields.slug,
      //period: node.fields.belongsToPeriod
      period: node.frontmatter.period
    }
  })
  days = days.sort((a, b) => a.sortField - b.sortField );
  
  const daysAsLinks = days.map(( day ) => {
    let newPeriod = null;
    if(period !== day.period){
      period = day.period;
      newPeriod = period;
    }
    return(
    <div key={day.id} >
      {newPeriod && <h3 style={{color:"#295683"}}>{day.period}</h3>}
      <Link to={day.slug}
        className={css`
          text-decoration: none;
          color: inherit;
          font-size: small;
        `}>
        <h4 className={css`
            margin-bottom: ${rhythm(1 / 5)};
            margin-top: ${rhythm(1 / 5)};  
          `}>
          {day.title}
        </h4>
        </Link>
        <p style={{color:"gray"}}>{day.info}</p>
    </div>
  )})
  let period = "";
  return (
    <Layout>
      <div>
        <h1
          className={css`
            display: inline-block;
            border-bottom: 1px solid;
            margin: 0px;
            color:#295683;
          `}
        >
          Full Semester Schedule
        </h1>
        <p style={{marginTop:8, fontStyle:"italic"}}>
        Don't count on information more more than 1-2 lessons into the future, 
        since content most likely will change</p>
        {/* <h4>{days.length} Posts</h4> */}
        {daysAsLinks}
      </div>
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            pageintro
            period
          }
          fields {
            slug
            belongsToPeriod
            shortTitle
          }
          excerpt
        }
      }
    }
  }
`