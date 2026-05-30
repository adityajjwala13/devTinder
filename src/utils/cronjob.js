const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail = require("./ses_sendemail");
// This job will run at 8 AM in the morning everyday
cron.schedule("25 16 * * *", async () => {
  //Send emails to all people who got requests the previous day
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      // createdAt: {
      //   $gte: yesterdayStart,
      //   $lt: yesterdayEnd,
      // },
    }).populate("fromUserId toUserId");
    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];
    console.log(listOfEmails);

    for (const email of listOfEmails) {
      //Send Emails
      try {
        const res = await sendEmail.run(
          "New Friend Requests pending for " + email,
          "There are so many connection requests pending so either accept/reject them asap..."
        );
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
