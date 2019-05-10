import React from "react";
import { getDateFromDkDate } from "./date_utils";
import linkExtractor from "./markdown-link-extractor";
import Layout from "../components/layout.js";

export default function createLinkSection(
  data,
  startTag,
  endTag,
  title,
  useLineBreaks

) {
  let days = data.allMarkdownRemark.nodes.filter(
    node => node.fields.belongsToPeriod
  );
  //console.log(days.map(({node})=>node.frontmatter.date))
  days = days.map(node => {
    //const node = d.node;
    const dateForTitle = `${node.fields.shortTitle}`;
    const rawMarkdownBody = node.rawMarkdownBody;
    const start = rawMarkdownBody.indexOf(startTag) + startTag.length;
    const end = rawMarkdownBody.indexOf(endTag);
    let htmlLinks = null;
    if (start > -1 && end > -1 && end > start) {
      const exercises = rawMarkdownBody.substring(start, end);
      const links = linkExtractor(exercises);
      const separator = useLineBreaks ? "<br/>" : " | ";
      htmlLinks = links
        .map(l => `<a href=${l.href} target="_blank">${l.text}</a>`)
        .join(separator);
    }

    return {
      title: `${dateForTitle} - ${node.frontmatter.title}`,
      sortField: getDateFromDkDate(node.fields.shortTitle).toString().toLowerCase(),
      id: node.id,
      info: node.frontmatter.pageintro,
      slug: node.fields.slug,
      period: node.fields.belongsToPeriod,
      htmlLinks
    };
  });
  days = days.filter(d => d.htmlLinks);
  days = days.sort((a, b) => a.sortField - b.sortField);
  return (
    <div>
      <h2>{title}</h2>
      <div>
        <p style={{ fontStyle: "italic" }}>
          Don't count on information more more than 1-2 lessons into the future
          since content most likely will change
        </p>
        <table>
          <tbody>
            {days.map(d => (
              <tr key={d.id}>
                <td>{d.title}</td>
                <td dangerouslySetInnerHTML={{ __html: d.htmlLinks }} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
