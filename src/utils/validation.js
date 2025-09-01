const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) throw new Error("Name is invalid!!!");
  else if (firstName.length < 4 || firstName.length > 50)
    throw new Error("FirstName should be between 4 - 50 characters");
  if (!validator.isEmail(emailId))
    throw new Error("Please enter valid emailId!!");
  if (!validator.isStrongPassword(password))
    throw new Error("Please enter strong password");
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "photoURL",
  ];
  const reqBodyFields = Object.keys(req.body);
  reqBodyFields.forEach((field) => {
    if (!allowedEditFields.includes(field))
      throw new Error("Invalid Edit Request");
  });
};

const validateEditPassword = async (req) => {
  const { currentPassword, newPassword } = req.body;
  const isCurrentPasswordCorrect = await req.user.validatePassword(
    currentPassword
  );
  if (!isCurrentPasswordCorrect)
    throw new Error("Current password is incorrect!!");
  if (!validator.isStrongPassword(newPassword))
    throw new Error("Please enter strong password");
};

module.exports = {
  validateSignUpData,
  validateEditProfileData,
  validateEditPassword,
};
