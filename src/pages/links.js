import { graphql } from "gatsby";
import LinkCollector,{LinkCollectorFromFrontMatter} from "../helpers/linkCollector";
import React from "react";
import Layout from "../components/layout";

export default class Links extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showSlidesDay: false };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(evt) {
    const target = evt.target;
    if (target.id === "showSlidesDay") {
      this.setState({ showSlidesDay: target.checked });
    }
  }

  render() {
    const data = this.props.data;
    return (
      <Layout>
        <h2>Guidelines used throughout the semester</h2>
        <LinkCollector
          data={data}
          tag="guides"
          removeDuplicates={true}
          render={links => (
            <table>
              <tbody>
                {links.map(d => {
                  const html = d.htmlLinks.map(l => l.html).join("<br/>");
                  return (
                    <tr key={d.id}>
                      <td style={{width:"40%"}}>{d.title}</td>
                      <td dangerouslySetInnerHTML={{ __html: html }} />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        />
        <h2>
          List of studypoint exercises (friday exercises) given throughout the
          semester
        </h2>
        
        <LinkCollectorFromFrontMatter
          data={data}
          prop="isSP"
          removeDuplicates={true}
          render={allLinks => (
            <table>
              <tbody>
                {allLinks.map(d => {
                  const html = d.htmlLinks.map(l=>l.html).join(" | ")
                  return (
                  <tr key={d.id}>
                    <td style={{width:"40%"}}>{d.title}</td>
                    <td dangerouslySetInnerHTML={{ __html: html }} />
                  </tr>
                )})}
              </tbody>
            </table>
          )}
        />

        <h2>List of CA's (Course Assignments)</h2>
        <LinkCollector
          data={data}
          tag="ca"
          removeDuplicates={true}
          render={links =>{ 
            return (
            <ul>
              {links.map(d => {
               const html = d.htmlLinks.map(l => l.html).join(" | ");
               return (<li
                  key={d.id}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )})}
            </ul>
          )}}
        />
        <h2>
          List of Slides used throughout the semester &nbsp;
          <span style={{ fontSize: "small" }}>
            <label>
              Show (last) day used: &nbsp;
              <input
                id="showSlidesDay"
                type="checkbox"
                onChange={this.handleChange}
                checked={this.state.showSlidesDay}
              />
            </label>
          </span>
        </h2>
        <LinkCollector
          data={data}
          tag="slides"
          useLineBreaks={true}
          removeDuplicates={true}
          render={links => (
            <table>
              <tbody>
                {links.map(d => {
                  const html = d.htmlLinks.map(l=>l.html).join("</br>")
                  return (
                  <tr key={d.id}>
                    {this.state.showSlidesDay && <td>{d.title}</td>}
                    <td dangerouslySetInnerHTML={{ __html: html }} />
                  </tr>
                )})}
              </tbody>
            </table>
          )}
        />
      </Layout>
    );
  }
}

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
    allMarkdownRemark {
      totalCount
      nodes {
        id
        rawMarkdownBody
        frontmatter {
          title
          pageintro
          isSP
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
