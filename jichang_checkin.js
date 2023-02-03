const { gotScraping } = require("got-scraping");
const { CookieJar } = require("tough-cookie");
const { sendNotify } = require("./sendNotify");
const url = process.env.JC_URL;
const email = process.env.JC_EMAIL;
const passwd = process.env.JC_PASSWD;
const noti = process.env.JC_NOTI;
const cookieJar = new CookieJar();
const log = async (content) => {
  console.log(content);
  if (noti) await sendNotify(`机场签到 ${url}`, content, (author = ""));
};
async function main() {
  console.log("正在登录...");
  await gotScraping
    .post(new URL("/auth/login", url), {
      json: { email, passwd },
      responseType: "json",
      cookieJar,
    })
    .then((r) => log(r.body["msg"]));
  await gotScraping
    .post(new URL("/user/checkin", url), { responseType: "json", cookieJar })
    .then((r) => log(r.body["msg"]));
}

main().catch((err) => log(err));
