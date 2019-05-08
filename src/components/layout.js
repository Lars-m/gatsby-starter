import React from "react";
import Modal from "./Modal";
//import logo from "./bitmap.png";
import logo from "../../images/logo.png";
import offline from "../../images/offline.svg";
import { StaticQuery, Link, graphql } from "gatsby";

import "../../images/css/font-awesome.css";
import "../../style.css";
import all from "../helpers/periodLinks";
const { getLinksForAllPeriods, setCurrentPeriod, getLinksForCurrentPeriod } = all.linkFacade;

function getPeriodfromSlug(slug) {
  //We don't care about index.md files so a minimum of three "/" must be present
  //A slug could be: "/period1/day2/"
  return `/${slug.split("/")[1]}/`;
}

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

  /* render(){
    const data = this.props;
    console.log(data.allMarkdownRemark.nodes)
   // const linksForAll = getLinksForAllPeriods(data.allMarkdownRemark.nodes);
    return <div>Hello World</div>
  } */
  render() {
    //console.log("STATE", this.state);
    const data = this.props;
   
    console.log(data.allMarkdownRemark.nodes)
    //const map = linksForAllPeriods(data.allMarkdownRemark.edges);
    const linksForAll = getLinksForAllPeriods(data.allMarkdownRemark.nodes);
    console.log("ALL",linksForAll)
    const subLinks = getLinksForCurrentPeriod();
    //console.log("SUBLINGS", subLinks)
    const subLinksHTML = subLinks.map((n, index) => {
      const slug = n.fields.slug;
      //console.log("SLUG--->", slug);
      return (
        <React.Fragment key={index}>
          <Link key={n.id} to={slug} activeClassName="active">
            <span id={getPeriodfromSlug(slug)}>
              {n.frontmatter.date}
            </span>
          </Link>
        </React.Fragment>
      );
    });

    const topLinks = data.site.siteMetadata.topMenu.map(l => {
      if (!(l.URL || l.route)) {
        throw new Error("Either a URL or a route must be provided for a topMenu entry")
      }
      return l.URL ?
        (<a key={l.title} href={l.URL} target="_blank" rel="noopener noreferrer"> {l.title}</a>) :
        (<Link key={l.title} to={l.route} target="_blank" activeClassName="active"> {l.title}</Link>)

    })

    let links = [];
    for (let p in linksForAll) {
      //console.log("SLUGPART",linksForAll[p].slugPart)
      links.push((
        <Link key={linksForAll[p].id} onClick={() => console.log("Cliecked")} to={linksForAll[p].slugPart} activeClassName="active">
          <span id={linksForAll[p].slugPart}>{linksForAll[p].period}</span>
        </Link>
      ))
    }
    return (
      <div
        //This is "hacky", but it gets the id from the inner span in a-tags
        onClick={e => {
          let tagName = e.target.tagName.toUpperCase();
          //console.log("TagName", tagName, e.target.innerText, e.target.id);
          if (
            tagName === "A" &&
            e.target.children[0] &&
            e.target.children[0].tagName === "SPAN"
          ) {
            console.log("AAA", e.target.children[0].id)
            setCurrentPeriod(e.target.children[0].id);
          } else if (tagName === "SPAN") {
            setCurrentPeriod(e.target.id);
          } else {
            setCurrentPeriod("-");
          }
        }}
      >
        <div className="header">
          <div className="title">
            <img src={logo} alt="Logo" />
            <div style={{ alignSelf: "flex-start", marginLeft: "2em" }}>
              <h1>{data.site.siteMetadata.title1}</h1>
              <p>{data.site.siteMetadata.title2}</p>
            </div>
          </div>
          <div className="main-links">
            {topLinks}
          </div>
        </div>

        <div className="content-frame" >
          <div className="period-links">
            {links}
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
    render={data => (<Container {...data} children={children} />)}
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
          title URL route
        }
      }
    }
  }
`;
