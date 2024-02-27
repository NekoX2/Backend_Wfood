const { request } = require("express");
const Events = require("../models/Events");
const { notifyEvent, notifyEvening } = require("../functions/notify");
const cron = require("node-cron");
const moment = require("moment");
const fs = require("fs");
const { title } = require("process");
const nodemailer = require('nodemailer');

exports.createEvent = async (req, res) => {
  try {
    res.send(await Events(req.body).save());
  } catch (err) {
    console.log("Server Error");
    res.status(500).send("Server Error!!!");
  }
};

exports.listEvent = async (req, res) => {
  try {
    res.send(await Events.find({}));
  } catch (err) {
    console.log("Server Error");
    res.status(500).send("Server Error!!!");
  }
};

exports.updateEvent = async (req, res) => {
  try {
    res.send(
      await Events.findOneAndUpdate(
        { _id: req.body.id },
        { start: req.body.start, end: req.body.end }
      )
    );
    console.log(req.body.id);
  } catch (err) {
    console.log("Server Error");
    res.status(500).send("Server Error!!!");
  }
};

exports.removeEvent = async (req, res) => {
  try {
    console.log(req.params.id)
    const removeEvent = await Events.findOneAndDelete(
      { _id: req.params.id })
    console.log(removeEvent.filename)
    await fs.unlink('./public/uploads/' + removeEvent.filename, (err) => {

      if (err) {
        console.log(err);
      } else {
        console.log("remove Success");
      }
    })
  } catch (err) {
    console.log("Server Error");
    res.status(500).send("Server Error!!!");
  }
};

exports.currentMonth = async (req, res) => {
  try {
    const m = parseInt(req.body.mm);
    console.log(typeof m);
    console.log(req.body.mm);
    const currentM = await Events.find({
      $expr: {
        $eq: [
          {
            $month: "$start",
          },
          m,
        ],
      },
    }).sort({ start: 1 });
    console.log(currentM);
    res.send(currentM);
  } catch (err) {
    console.log("Server Error");
    res.status(500).send("Server Error!!!");
  }
};

const currentDate = async () => {
  try {
    const d = new Date();
    const currentD = await Events.find({}).sort({ start: 1 });
    const current = currentD.filter((item) => {
      return d >= item.start && d < item.end;
    });
    for (t in current) {
      // console.log(current[t].start)
      const msg = "\nวันนี้มีกิจกรรม : " + current[t].title + "\nชื่อผู้จอง : " + current[t].user + "\nหมายเหตุ : " + current[t].about;
      notifyEvent(msg);
      const transporter = nodemailer.createTransport({
        host: 'smtp.wfoodsolutions.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'thanapon.bua@wfoodsolutions.com',
          pass: 'Kong082513!'
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      const option = {
        from: 'thanapon.bua@wfoodsolutions.com',
        to: 'itsupport@wfoodsolutions.com',
        subject: 'Test Node Mailer',
        html: `
            <p>Hello World! Welcome to Nodemailer</p>
            <p>${msg}</p>
        `
      };

      transporter.sendMail(option, (err, info) => {
        if (err) {
          console.error('Error:', err);
          res.status(400).json({
            RespCode: 400,
            RespMessage: 'failed',
            RespError: err.toString(),
          });
        } else {
          console.log('Send:', info.response);
          res.status(200).json({
            RespCode: 200,
            RespMessage: 'success',
          });
        }
      });
    }
    // console.log(current)
    // res.send(current)
  } catch (err) {
    console.log("Server Error!");
    // res.status(500).send('Server Error!!')
  }
};

exports.updateImage = async (req, res) => {
  try {
    const id = req.body.id;
    const filename = req.file.filename;
    const updateImage = await Events.findOneAndUpdate(
      { _id: id },
      { filename: filename }
    );
    res.send(updateImage);
  } catch (err) {
    console.log(err);
    res.status(500).send("server Error");
  }
};

exports.update = async (req, res) => {
  try {
    //code
    const id = req.params.id;
    const updated = await Events
      .findOneAndUpdate({ _id: id }, req.body, { new: true })
      .exec();
    res.send("Hello Controller update");
  } catch (err) {
    //error
    console.log(err);
    res.status(500).send("Server Error");
  }
};

const currentEvening = async () => {
  try {
    const d = new Date();
    const currentD = await Events.find({}).sort({ start: 1 });
    const current = currentD.filter((item) => {
      return d >= item.start && d < item.end;
    });
    for (t in current) {
      // console.log(current[  t].start)
      const msg = "วันนี้มีกิจกรรม" + current[t].title;
      console.log("curren notify", t);
      console.log("filename", current[t].filename);
      notifyEvening(msg, current[t].filename);
    }
    // res.send(current)
    console.log(current.length);
  } catch (err) {
    console.log(err);
  }
};

// notifly 07.00
cron.schedule('56 16 * * *', () => {
  currentDate()
});

// notifly 19.00
cron.schedule("39 16 * * *", () => {
  currentEvening();
});
