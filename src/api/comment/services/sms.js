module.exports = {
    sendSms() {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const myNum = process.env.MYNUM;
      const twilioNum = process.env.TWILIONUM;
      const client = require("twilio")(accountSid, authToken);
      client.messages
        .create({
          body: "Hello Admin, someone just posted a comment",
          from: twilioNum, //the phone number provided by Twillio
          to: myNum, // your own phone number
        })
        .then((message) => console.log(message.sid));
    },
  };