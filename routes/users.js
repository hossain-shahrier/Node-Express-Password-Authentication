const express = require("express");

const router = express.Router();
const bcrypt = require("bcryptjs");
// User model
const User = require("../models/User");
// Login page
router.get("/login", (req, res) => {
  res.render("login");
});
// Register page
router.get("/register", (req, res) => {
  res.render("register");
});
// Register handle
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  // Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please fill in all fields" });
  }
  // Check passwords match
  if (password !== password2) {
    errors.push({ message: "Passwords didn't match " });
  }
  // Check passwords length
  if (password.length < 6) {
    errors.push({ message: "Passwords should be at least 6 charecters " });
  }
  // Input values stays there
  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    // Validation passed
    User.findOne({ email: email }).then((user) => {
      if (user) {
        // User exist
        errors.push({ message: "Email is already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        //  Hash Password
        bcrypt.genSalt(10, (error, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // Set password to hashed
            newUser.password = hash;
            // Save user
            newUser
              .save()
              .then((user) => {
                res.redirect("./login");
              })
              .catch((err) => console.error(err));
          });
        });
      }
    });
  }
});

module.exports = router;
