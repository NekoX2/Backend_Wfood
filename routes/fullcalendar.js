const express = require("express");
const router = express.Router();
const nodemailer = require('nodemailer');
/* Multer */
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "file-" +
      Date.now() +
      "." +
      file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

const upload = multer({ storage: storage }).single("file");
/* End Multer */

const {
  createEvent,
  listEvent,
  currentMonth,
  updateImage,
  updateEvent,
  update,
  removeEvent,
} = require("../controller/fullcalendar");

//@Endpoint         localhost:5000/api/event
//@Method           Post
//@Access           Public
router.post("/event", createEvent);

//@Endpoint         localhost:5000/api/event
//@Method           GET
//@Access           Public
router.get("/event", listEvent);

//@Endpoint         localhost:5000/api/event
//@Method           PUT
//@Access           Public
router.put("/event", updateEvent);

router.put("/event/:id", update);


//@Endpoint         localhost:5000/api/event
//@Method           DELETE
//@Access           Public
router.delete("/event/:id", removeEvent);

//@Endpoint         localhost:5000/api/event
//@Method           GET
//@Access           Public
// router.get("/event/:id", queyEvent);

//@Endpoint         localhost:5000/api/current-month
//@Method           Post
//@Access           Public
router.post("/current-month", currentMonth);

//@Endpoint         localhost:5000/api/current-date
//@Method           GET
//@Access           Public
// router.get("/current-date", currentEvening);

//@Endpoint         localhost:5000/api/update-image
//@Method           POST
//@Access           Public
router.post("/update-image", upload, updateImage);


module.exports = router;
