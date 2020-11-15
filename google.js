"use strict";

const axios = require("axios");
const cheerio = require("cheerio");
const querystring = require("querystring");
const util = require("util");

const descSel = "div.s";
const itemSel = "div.kCrYT a";
const nextSel = "td.b a span";

const URL =
  "%s://www.google.%s/search?hl=%s&q=%s&start=%s&sa=N&num=%s&ie=UTF-8&oe=UTF-8&gws_rd=ssl";

const nextTextErrorMsg =
  "Translate `google.nextText` option to selected language to detect next results link.";
const protocolErrorMsg =
  "Protocol `google.protocol` needs to be set to either 'http' or 'https', please use a valid protocol. Setting the protocol to 'https'.";

function Google(query, start, callback) {
  let startIndex = 0;
  if (typeof callback === "undefined") {
    callback = start;
  } else {
    startIndex = start;
  }
  Search(query, startIndex, callback);
}

Google.resultsPerPage = 10;
Google.tld = "com";
Google.lang = "en";
Google.requestOptions = {};
Google.nextText = "Tiếp";
Google.protocol = "https";

const Search = function (query, start, callback) {
  if (Google.resultsPerPage > 100) Google.resultsPerPage = 100; // Google won't allow greater than 100 anyway
  if (Google.lang !== "en" && Google.nextText === "Next")
    console.warn(nextTextErrorMsg);
  if (Google.protocol !== "http" && Google.protocol !== "https") {
    Google.protocol = "https";
    console.warn(protocolErrorMsg);
  }

  // timeframe is optional. splice in if set
  if (Google.timeSpan) {
    URL =
      URL.indexOf("tbs=qdr:") >= 0
        ? URL.replace(/tbs=qdr:[snhdwmy]\d*/, "tbs=qdr:" + Google.timeSpan)
        : URL.concat("&tbs=qdr:", Google.timeSpan);
  }
  const newUrl = util.format(
    URL,
    Google.protocol,
    Google.tld,
    Google.lang,
    querystring.escape(query),
    start,
    Google.resultsPerPage
  );

  axios
    .get(newUrl)
    .then((resp) => {
      const links = [];
      const $ = cheerio.load(resp.data);
      const res = {
        url: newUrl,
        query: query,
        start: start,
        links: [],
        $: $,
        body: resp.data,
      };
      $(itemSel).each(function (i, elem) {
        const h3 = $(elem).find("h3 div");
        const item = {
          title: h3.text(),
          link: null,
          description: null,
          href: null,
        };
        const qsObj = querystring.parse($(elem).attr("href"));

        if (qsObj["/url?q"]) {
          item.link = qsObj["/url?q"];
          item.href = item.link;
        }

        if (item.href && item.title.length) {
          links.push(item);
        }
      });

      if ($(nextSel).last().text() === Google.nextText) {
        res.next = function () {
          Search(query, start + Google.resultsPerPage, callback);
        };
      }

      callback(null, links);
    })
    .catch((err) => {
      callback(err, null, null);
    });
};

module.exports = Google;
