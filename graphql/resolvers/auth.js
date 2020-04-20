const bcrypt = require('bcryptjs');

const User = require('../../models/user');

module.exports = {
  createUser: async ({ userInput }) => {
    const { email, password } = userInput;
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (error) {
      throw error;
    }
  },
};
