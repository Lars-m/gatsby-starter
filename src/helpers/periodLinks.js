function getDateFromDkDate(date) {
  if (date === null || !date.includes("-")) {
    throw new Error("No date provided: "+date);
  }
  const dp = date.split("-");
  return new Date(dp[2], dp[1] - 1, dp[0]);
}

/*
returns all links for a period given via the slug
*/
function periodLinks(edges, slug) {
  const days = edges
    .filter(e => {
      //console.log(e.node.fields.slug,periodTitle);
      const isIndex =
        e.node.fields.isSubPeriodDescription ||
        e.node.fields.isPeriodDescription;
      const matchesSlug = e.node.fields.slug.indexOf(slug) >= 0;
      //console.log("MATCH",matchesSlug && !isIndex,matchesSlug,!isIndex)
      return matchesSlug && !isIndex;
    })
    .map(e => {
      if(!e.node.frontmatter.date)
      console.log("DATE",e.node.frontmatter)
      e.dateFromStr = getDateFromDkDate(e.node.frontmatter.date);
      return e;
    });
  //console.log("DAYS", days);
  const sorted = days.sort(
    (a, b) => a.dateFromStr.getTime() - b.dateFromStr.getTime()
  );
  //console.log("Sorted", sorted);
  return sorted;
}

function linksFacade() {
  let asMap = null;
  let currentPeriod = "";
  return {
    setCurrentPeriod: current => {
      console.log("CURRENT",current)
      currentPeriod = current
    },
    getLinksForCurrentPeriod: () => {
      if (asMap[currentPeriod]) {
        return asMap[currentPeriod].subLinks;
      }
      return [];
    },
    getLinksForAllPeriods: edges => {
      if (asMap !== null) {
        //console.log("CACHED")
        return asMap;
      }
      const periods = edges
        .filter(e => e.node.fields.isPeriodDescription)
        .map(e => {
          //let period;
          //  if (e.node.fields.isSubPeriodDescription) {
          //    period = e.node.fields.slug.split("/")[2];
          //  } else {
          //const slugPart = e.node.fields.slug.split("/")[1];
          const slugPart = e.node.fields.slug;
          const id = e.node.id;
          const period = e.node.frontmatter.period;
          //console.log("PERIOD",period,id,slugPart,"---",e.node.fields.slug);
          return { slugPart, period, id };
        });

      const sortedMap = periods.sort((a, b) =>
        a.slugPart.toLowerCase() >= b.slugPart.toLowerCase() ? 1 : -1
      );

      const subPeriods = edges
        .filter(e => e.node.fields.isSubPeriodDescription)
        .map(e => {
          const sub = e.node.fields.slug.split("/")[2];
          const parent = e.node.fields.slug.split("/")[1];
          const period = e.node.frontmatter.period;
          //console.log("hhh->",sub,parent,period,e.node.fields.slug);
          return { sub, parent, period };
        })
        .reduce((acc, current) => {
          const period = current.period;
          if (acc[period]) {
            throw Error("Duplicate Period Titles found: " + period);
          }
          acc[period] = current;
          return acc;
        }, {});

      console.log("SUB", subPeriods);
      asMap = sortedMap.reduce((accumulator, current) => {
        const p = current.slugPart;
        if (accumulator[p]) {
          throw Error("Duplicate Period Titles found: " + p);
        }
        accumulator[p] = {
          period: current.period,
          slugPart: current.slugPart,
          id: current.id,
          subLinks: []
        };
        return accumulator;
      }, {});
      for (let p in asMap) {
        const pl = periodLinks(edges, asMap[p].slugPart);
        asMap[p].subLinks = pl;
      }
      //console.log("AS_Map",asMap)
      return asMap;
    }
  };
}
const linkFacade = linksFacade();
export default {
  linkFacade: linkFacade,
  periodLinks: periodLinks
};
