import "dotenv/config";
import sailthruClient from "sailthru-client";
// Figure out how to handle ALL publications
const sailthru = sailthruClient.createSailthruClient(
  process.env.devApiKey,
  process.env.devApiSecret
);

const getExportList = async (list) => {
  let options = {
    list: list,
  };
  return new Promise((resolve, reject) => {
    sailthru.processJob("export_list_data", options, (err, response) => {
      try {
        resolve(response);
      } catch {
        reject(err);
      }
    });
  });
};

const getJobStatus = async (job_id) => {
  return new Promise((resolve, reject) => {
    sailthru.getJobStatus(job_id, (err, response) => {
      try {
        resolve(response);
      } catch {
        reject(err);
      }
    });
  });
};

/*
      var options = {vars: {color: 'blue'}, schedule_time: 'tomorrow 5pm'};
  */

const sendMultiEmail = async (template, emails, options) => {
  return new Promise((resolve, reject) => {
    sailthru.multiSend(template, emails, options, (err, response) => {
      try {
        resolve(response);
      } catch {
        reject(err);
      }
    });
  });
};

export { getExportList, getJobStatus, sendMultiEmail };
