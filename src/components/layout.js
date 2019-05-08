import React from "react";
import Modal from "./Modal";
import logo from "../../images/logo.png";
import offline from "../../images/offline.svg";
import { StaticQuery, Link, graphql } from "gatsby";

import "../../images/css/font-awesome.css";
import "../../style.css";
import selectedPages from "../helpers/pagesForMenu";

class Container extends React.Component {
  constructor(props) {
    super(props);
    //necessary since first time it executes it's done by node and not in a browser
    console.log("IN CONSTRUCTOR");
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

  onClick = pages => {
    selectedPages.setPages(pages);
  };

  render() {
    const data = this.props;
    const nodes = data.allMarkdownRemark.nodes;

    const pageLinksLevelTop = nodes
      .filter(n => n.fields.isIndex && n.fields.depth === 1)
      .sort((a, b) =>
        a.fields.shortTitle.toLowerCase() >= b.fields.shortTitle.toLowerCase()
          ? 1
          : -1
      );

    const plt = pageLinksLevelTop.map(l => {
      const pages = nodes.filter(
        n => {
          const include = !n.fields.isIndex 
                          && n.fields.inFolder === l.fields.inFolder 
                          || l.fields.inFolder === n.fields.parentFolder && n.fields.isIndex;
          return include;
          
        }
      );
      l.pages = pages;
      return l;
    });
    //console.log(plt);

    const subLinksHTML = selectedPages.getPages().map(n => {
      return (
        <Link key={n.id} to={n.fields.slug} activeClassName="active">
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
          {" "} {l.title}
        </a>
      ) : (
        <Link key={l.title} to={l.route} target="_blank" activeClassName="active">
          {" "}{l.title}
        </Link>
      );
    });
    let pageLinksLevel1 = plt.map(p => (
      <Link
        key={p.id}
        to={p.fields.slug}
        onClick={() => this.onClick(p.pages)}
        activeClassName="active"
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
