import { graphql } from "gatsby";
import LinkCollector from "../helpers/linkCollector";
import React from "react";
import Layout from "../components/layout";

export default class Links extends React.Component {
  constructor(props){
    super(props)
    this.state = {showSlidesDay: false}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(evt){
    const target = evt.target;
    if(target.id === 'showSlidesDay') {
      this.setState({showSlidesDay:target.checked})
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
          useLineBreaks={true}
          removeDuplicates={true}
          render={links => (
            <table>
              <tbody>
                {links.map(d => (
                  <tr key={d.id}>
                    <td dangerouslySetInnerHTML={{ __html: d.htmlLinks }} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        />
        <h2>
          List of studypoint exercises (friday exercises) given throughout the
          semester
        </h2>
        <LinkCollector
          data={data}
          tag="sp"
          useLineBreaks={true}
          removeDuplicates={true}
          render={links => (
            <ul>    
            {links.map(d => <li key={d.id} dangerouslySetInnerHTML={{ __html: d.htmlLinks }} />)}  
            </ul>
          )}
        />
        <h2>
          List of CA's (Course Assignments)
        </h2>
        <LinkCollector
          data={data}
          tag="ca"
          useLineBreaks={true}
          removeDuplicates={true}
          render={links => (
            <ul>    
            {links.map(d => <li key={d.id} dangerouslySetInnerHTML={{ __html: d.htmlLinks }} />)}  
            </ul>
          )}
        />
        <h2>
          List of Slides used throughout the semester &nbsp; 
          <span style={{ fontSize: "small" }}>
          <label>
            Show (last) day used: &nbsp;
            <input id="showSlidesDay" 
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
              {links.map(d => (
                <tr key={d.id}>
                  {this.state.showSlidesDay && <td>{d.title}</td>}
                  <td dangerouslySetInnerHTML={{ __html: d.htmlLinks }} />
                </tr>
              ))}
            </tbody>
          </table>)}
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
