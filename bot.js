"use strict";

const search = async (google, keyword) => {
  console.log("Search:", keyword);
  return new Promise((resolve, reject) => {
    google(keyword, function (err, links) {
      if (err) return reject(err);
      return resolve(links);
    });
  });
};

const searchRank = async (google, keyword, domain) => {
  const links = await search(google, keyword);
  const totalLinks = links.length;

  for (var i = 0; i < totalLinks; ++i) {
    const link = links[i];
    if (link.href.includes(domain)) {
      return {
        keyword,
        domain,
        page: link.title,
        url: link.href,
        index: i + 1,
      };
    }
  }
  return null;
};

module.exports = {
  search,
  searchRank,
};
