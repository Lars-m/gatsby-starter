import React from "react";
import Modal from "./Modal";
import logo from "../../images/logo.png";
import offline from "../../images/offline.svg";
import { StaticQuery, Link, graphql } from "gatsby";
import {getDateFromDkDate} from "../helpers/date_utils"

import "../../images/css/font-awesome.css";
import "../../style.css";
import selectedPages from "../helpers/pagesForMenu";

// function getDateFromDkDate(date) {
//   if (date === null || !date.includes("-")) {
//     return date;
//   }
//   const dp = date.split("-");
//   return new Date(dp[2], dp[1] - 1, dp[0]).getTime();
// }

class Container extends React.Component {
  constructor(props) {
    super(props);
    //necessary since first time it executes it's done by node and not in a browser
    this.state = { offline: false, showModal: false };
  }

  componentDidMount() {
    window.addEventListener("click", this.clicked);
    window.addEventListener("online", this.setOffline);
    window.addEventListener("offline", this.setOffline);
    this.setOffline();
  }
  componentWillUnmount() {
    window.removeEventListener("online", this.setOffline);
    window.removeEventListener("offline", this.setOffline);
    window.removeEventListener("click", this.clicked);
    this.setOffline();
  }

  /* Disable outgoing links when off-line */
  clicked = e => {
    if (this.state.offline && e.target.tagName.toUpperCase() === "A") {
      if (!e.target.getAttribute("href").startsWith("/")) {
        e.preventDefault();
        this.setState({ showModal: true });
        setTimeout(() => this.setState({ showModal: false }), 2000);
      }
    }
  };

  closeModal = () => this.setState({ showModal: false });
  setOffline = () => this.setState({ offline: !navigator.onLine });

  hasChildWithIndex = (folder, node) => {
    return folder === node.fields.parentFolder && node.fields.isIndex;
  }
  isMdFile = (node) => !node.fields.isIndex;
  nodeIsInFolder = (node,folder) => node.fields.inFolder === folder
  isMdFileAndInFolder = (node,folder) => this.isMdFile(node) && this.nodeIsInFolder(node,folder)
  
  setSubmenuForThisNode = (nodes,node, level) => {
    const folder = node.fields.inFolder;
    const isNotMdFile = node.fields.isIndex;
    const menuEntries = nodes.filter(n =>{ 
      if(n.fields.depth < level)
       return false;
      const isChildWithIndex = this.hasChildWithIndex(folder,n)
      const include = this.isMdFileAndInFolder(n,folder)
                      || (isNotMdFile && isChildWithIndex)
      if(include){
        n.sortField = getDateFromDkDate(n.fields.shortTitle).toString().toLowerCase();
      }
      return include;
    }).sort((a, b) => a.sortField >= b.sortField ? 1 : -1);
    selectedPages.setPages(menuEntries, level);
  };

  render() {
    const data = this.props;
    const nodes = data.allMarkdownRemark.nodes;
    //console.log("Levels",nodesPerLevel(nodes))

    const plt = nodes
      .filter(n => n.fields.isIndex && n.fields.depth === 1)
      .sort((a, b) => a.fields.shortTitle.toLowerCase() >= b.fields.shortTitle.toLowerCase() ? 1 : -1 );

   
    const subLinksHTML = selectedPages.getPages("LEVEL1").map(n => {
      return (
        <Link
          key={n.id}
          to={n.fields.slug}
          onClick={() => this.setSubmenuForThisNode(nodes,n, 2)}
          activeClassName="active"
          partiallyActive={true}
        >
          {n.fields.shortTitle}
        </Link>
      );
    });
    const subLinksLevel2HTML = selectedPages.getPages("LEVEL2").map(n => {
      return (
        <Link
          key={n.id}
          to={n.fields.slug}
          onClick={() => this.setSubmenuForThisNode(nodes,n, 2)}
          activeClassName="active"
        >
          {n.fields.shortTitle}
        </Link>
      );
    });

    const topLinks = data.site.siteMetadata.topMenu.map(l => {
      if (!(l.URL || l.route)) {
        throw new Error(
          "Either a URL or a route must be provided for a topMenu entry"
        );
      }
      return l.URL ? (
        <a key={l.title} href={l.URL} target="_blank" rel="noopener noreferrer">
          {" "}
          {l.title}
        </a>
      ) : (
        <Link key={l.title} to={l.route} onClick={()=>selectedPages.resetSubMenus()}
        target="_blank" activeClassName="active">
          {" "}{l.title}
        </Link>
      );
    });
    let pageLinksLevel1 = plt.map(p => (
      <Link
        key={p.id}
        to={p.fields.slug}
        onClick={() => this.setSubmenuForThisNode(nodes,p, 1)}
        activeClassName="active"
        partiallyActive={true}
      >
        {p.fields.shortTitle}
      </Link>
    ));

    return (
      <div>
        <div className="header">
          <div className="title">
            <img src={logo} alt="Logo" />
            <div style={{ alignSelf: "flex-start", marginLeft: "2em" }}>
              <h1>{data.site.siteMetadata.title1}</h1>
              <p>{data.site.siteMetadata.title2}</p>
            </div>
          </div>
          <div className="main-links">{topLinks}</div>
        </div>

        <div className="content-frame">
          <div className="period-links">
            {pageLinksLevel1}
            {/* HACK to ensure icon is preloaded while online*/}
            <img style={{ width: 1 }} src={offline} alt="dummy" />{" "}
            {this.state.offline && (
              <img className="online" src={offline} alt="off-line" />
            )}
          </div>
          <div className="link-days">{subLinksHTML}</div>
          <div className="link-days">{subLinksLevel2HTML}</div>
          <Modal
            key={this.state.showModal}
            header="Off-line"
            body="You are currently off-line"
            show={this.state.showModal}
            onClose={this.closeModal}
          />
          <div> {this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default ({ children }) => (
  <StaticQuery
    query={query}
    render={data => <Container {...data} children={children} />}
  />
);

var query = graphql`
  {
    allMarkdownRemark {
      nodes {
        id
        frontmatter {
          periodTitle
          period
          date
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
    site {
      siteMetadata {
        title1
        title2
        topMenu {
          title
          URL
          route
        }
      }
    }
  }
`;
