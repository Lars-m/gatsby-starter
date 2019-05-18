//import React from "react";
import { graphql } from "gatsby";
import LinkCollector from "../helpers/linkCollector";
import React from "react";
import Layout from "../components/layout"

export default ({ data }) => {
  return (
    <Layout>
      <div>
        <h2>All readings expected for this semester</h2>
        <LinkCollector
          data={data}
          tag="readings"
          useLineBreaks={true}
          removeDuplicates={true}
          render={allLinks => (
            <table>
              <tbody>
                {allLinks.map(d => (
                  <tr key={d.id}>
                    <td>{d.title}</td>
                    <td dangerouslySetInnerHTML={{ __html: d.htmlLinks }} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        />
      </div>
       
       
    </Layout>
  )
}

export const query = graphql`
  query {
    allMarkdownRemark {
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
          title
          shortTitle
          depth
          inFolder
          title
          fileName {
            relativePath
            base
          }
        }
      }
    }
  }
`;
