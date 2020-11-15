const fs = require("fs");
const Google = require("./google");
const bot = require("./bot");
const { SaveFile } = require("./excel");

const rawOptionData = fs.readFileSync("option.json");
const option = JSON.parse(rawOptionData);

Google.lang = "vi";
Google.resultsPerPage = option.resultsPerPage;
Google.protocol = "https";

async function main() {
  console.log("Domain: ", option.domain);
  try {
    const results = [];
    const length = option.keywords.length;
    for (let i = 0; i < length; i++) {
      const result = await bot.searchRank(
        Google,
        option.keywords[i],
        option.domain
      );
      results.push(result);
    }

    const dataSheets = [];
    results.map((e) => {
      dataSheets.push([e.keyword, e.index]);
    });

    console.log("Save excel file...");
    await SaveFile(dataSheets);
    console.log("Done.");
  } catch (error) {
    console.error(error);
  }
}

main();
