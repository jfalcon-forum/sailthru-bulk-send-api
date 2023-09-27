import fs from "fs";
import { Readable } from "stream";
import { getExportList, getJobStatus, sendMultiEmail } from "./sailthru-api.js";

async function* chunksToLines(chunkIterable) {
  let prev = "";
  for await (const chunk of chunkIterable) {
    let startSearch = prev.length;
    prev += chunk;
    while (true) {
      const eolIndex = prev.indexOf("\n", startSearch);
      if (eolIndex < 0) break;
      const line = prev.slice(0, eolIndex + 1);
      yield line;
      prev = prev.slice(eolIndex + 1);
      startSearch = 0;
    }
  }
  if (prev.length > 0) {
    yield prev;
  }
}

async function* numberLines(lineIterable) {
  let lineNumber = 1;
  for await (const line of lineIterable) {
    const refineLine = line.split(",");
    yield refineLine[0].trim();
    lineNumber++;
  }
}

async function massSend(lineIterable) {
  let prev = "";
  let arr = [];
  let sendCount = 0;
  for await (const line of lineIterable) {
    // temp check against first row values; should create better validation function in future
    if (line === "email") {
      continue;
    }
    if (arr.length < 5) {
      arr.push(line);
    } else {
      // logic to send emails
      // need to add sleep function to space out calls to adhere to 200 request/second & 12,000 per minute
      // could send a 1,000 emails per second lol that's a ton!
      // also send_count inconsistent but we'll need to handle any errors and keep track of emails that don't send
      let { send_count } = await sendMultiEmail("inforum_test_template", arr);
      sendCount += send_count;
      arr = [];
      arr.push(line);
    }
  }
  if (arr.length > 0) {
    let { send_count } = await sendMultiEmail("inforum_test_template", arr);
    sendCount += send_count;
  }
  console.log(sendCount);
}

const chunks = fs.createReadStream("jfalcon_test.csv", {
  encoding: "utf-8",
});

massSend(numberLines(chunksToLines(chunks)));
