import { getDateFromDkDate } from "./date_utils";
import linkExtractor from "./markdown-link-extractor";

function getTheLinks(rawMarkdownBody, start, end, allLinksFound, removeDuplicates, useLineBreaks) {
  const linkPartOfBody = rawMarkdownBody.substring(start, end);
  let linksFound = linkExtractor(linkPartOfBody).map(link => {
    const linkIsExternal = link.href.startsWith("http");
    const target = linkIsExternal ? 'target="_blank"': "";
    const returnLink = `<a href=${link.href} ${target}>${link.text}</a>`;
      // ? `<a href=${link.href} target="_blank">${link.text}</a>`
      // : `<a href=${link.href}>${link.text}</a>`;
    const duplicate = allLinksFound.includes(link.href);
    if (duplicate && removeDuplicates) {
      return null;
    }
    else {
      allLinksFound.push(link.href);
    }
    return returnLink;
  })
  .filter(l => l != null); //Remove the null entries
  let separator = useLineBreaks ? "<br/>" : " | ";
  separator = linksFound.length > 1 ? separator : "";
  return linksFound.join(separator);
}

function getLinks(data,startTag,endTag,useLineBreaks, removeDuplicates){

  const allLinksFound = [];
  let links = data.allMarkdownRemark.nodes.filter(
    node => node.fields.belongsToPeriod
  );
  links = links.map(node => {
    const dateForTitle = `${node.fields.shortTitle}`;
    const rawMarkdownBody = node.rawMarkdownBody;
    const start = rawMarkdownBody.indexOf(startTag) + startTag.length;
    const end = rawMarkdownBody.indexOf(endTag);
    let htmlLinks = null;
    if (start > -1 && end > -1 && end > start) {
      htmlLinks = getTheLinks(rawMarkdownBody, start, end, allLinksFound, removeDuplicates, useLineBreaks);
    }
    return {
      title: `${dateForTitle} - ${node.frontmatter.title}`,
      sortField: getDateFromDkDate(node.fields.shortTitle)
        .toString()
        .toLowerCase(),
      id: node.id,
      info: node.frontmatter.pageintro,
      slug: node.fields.slug,
      period: node.fields.belongsToPeriod,
      htmlLinks
    };
  })
  .filter(d => d.htmlLinks)
  .sort((a, b) => a.sortField - b.sortField);
  return links;
}



/*
  Tags must always be defined using the pattern:
  <!--NAME_begin--> and <!--NAME_end-->
*/
export default function LinkCollector({data,tag,useLineBreaks, removeDuplicates,render}) {
  const start = `<!--${tag}_begin-->`;
  const end = `<!--${tag}_end-->`;
  const links = getLinks(data,start,end,useLineBreaks,removeDuplicates);
  return (
    render(links)
  );
}


/*
import React from "react";
import { getDateFromDkDate } from "./date_utils";
import linkExtractor from "./markdown-link-extractor";
import Layout from "../components/layout.js";

export default function createLinkSection(
  data,
  startTag,
  endTag,
  title,
  useLineBreaks,
  removeDuplicates
) {
  const allLinksFound = [];
  let days = data.allMarkdownRemark.nodes.filter(
    node => node.fields.belongsToPeriod
  );
  
  days = days.map(node => {
    const dateForTitle = `${node.fields.shortTitle}`;
    const rawMarkdownBody = node.rawMarkdownBody;
    const start = rawMarkdownBody.indexOf(startTag) + startTag.length;
    const end = rawMarkdownBody.indexOf(endTag);
    let htmlLinks = null;
    if (start > -1 && end > -1 && end > start) {
      const exercises = rawMarkdownBody.substring(start, end);
      const links = linkExtractor(exercises);
      let linksFound = links.map(link => {
        const linkIsExternal = link.href.startsWith("http");
        const returnLink = linkIsExternal
          ? `<a href=${link.href} target="_blank">${link.text}</a>`
          : `<a href=${link.href}>${link.text}</a>`;
        const duplicate = allLinksFound.includes(link.href);
        if (duplicate && removeDuplicates) {
          return null;
        } else {
          allLinksFound.push(link.href);
        }
        return returnLink;
      }).filter(l=>l != null);
      console.log("FOUND",linksFound.length)
      let separator = useLineBreaks ? "<br/>" : " | ";
      separator = linksFound.length >1 ? separator : ""
    
      htmlLinks = linksFound.join(separator);
    }
    return {
      title: `${dateForTitle} - ${node.frontmatter.title}`,
      sortField: getDateFromDkDate(node.fields.shortTitle)
        .toString()
        .toLowerCase(),
      id: node.id,
      info: node.frontmatter.pageintro,
      slug: node.fields.slug,
      period: node.fields.belongsToPeriod,
      htmlLinks
    };
  })
  .filter(d => d.htmlLinks)
  .sort((a, b) => a.sortField - b.sortField);
  return (
    <div>
      <div>
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
*/