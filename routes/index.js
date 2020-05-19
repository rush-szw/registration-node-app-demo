const express = require("express");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const router = express.Router();
const Registration = mongoose.model("Registration");

const path = require("path");
const auth = require("http-auth");

const basic = auth.basic({
  file: path.join(__dirname, '../users.htpasswd'),
});

router.get("/", (req, res) => {
  res.render("form", { title: "Registration form" });
});

router.post(
  "/",
  [
    check("name").isLength({ min: 1 }).withMessage("用户名不能为空"),
    check("email").isLength({ min: 1 }).withMessage("邮件不能为空"),
  ],
  (req, res) => {
    // console.log(req.body);
    // res.render("form", { title: "注册表单" });
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      // res.send('注册成功！')
      const registration = new Registration(req.body);
      registration
        .save()
        .then(() => {
          res.send("注册成功！");
        })
        .catch((err) => {
          console.log(err);
          res.send("抱歉，注册失败了。");
        });
    } else {
      res.render("form", {
        title: "注册表单",
        errors: errors.array(),
        data: req.body,
      });
    }
  }
);

router.get("/users", basic.check((req, res) => {
  // res.render("users", { title: "所有注册用户" });
  Registration.find()
    .then((users) => {
      res.render("users", { title: "所有注册用户", users });
    })
    .catch(() => {
      res.send("抱歉，查询错误.");
    });
}));

module.exports = router;
