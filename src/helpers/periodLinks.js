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
function periodLinks(nodes, slug) {
  const days = nodes
    .filter(e => {
      const isIndex =
        e.fields.isSubPeriodDescription ||
        e.fields.isPeriodDescription;
      const matchesSlug = e.fields.slug.indexOf(slug) >= 0;
      //console.log("MATCH",matchesSlug && !isIndex,matchesSlug,!isIndex)
      return matchesSlug && !isIndex;
    })
    .map(e => {
      if(!e.frontmatter.date)
      console.log("DATE",e.frontmatter)
      e.dateFromStr = getDateFromDkDate(e.frontmatter.date);
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
    getLinksForAllPeriods: nodes => {
     
      if (asMap !== null) {
        //console.log("CACHED")
        return asMap;
      }
      const periods = nodes
        .filter(e => e.fields.isPeriodDescription)
        .map(e => {
         
          const slugPart = e.fields.slug;
          const id = e.id;
          const period = e.frontmatter.period;
          //console.log("PERIOD",period,id,slugPart,"---",e.node.fields.slug);
          return { slugPart, period, id };
        });

      const sortedMap = periods.sort((a, b) =>
        a.slugPart.toLowerCase() >= b.slugPart.toLowerCase() ? 1 : -1
      );

      const subPeriods = nodes
        .filter(e => e.fields.isSubPeriodDescription)
        .map(e => {
          const sub = e.fields.slug.split("/")[2];
          const parent = e.fields.slug.split("/")[1];
          const period = e.frontmatter.period;
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
        const pl = periodLinks(nodes, asMap[p].slugPart);
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
