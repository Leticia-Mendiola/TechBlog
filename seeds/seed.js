const sequelize = require('../config/connection');
const { Comments, Posts, User } = require('../models');

const userData = require('./userData.json');
const posts = require('./exampleposts.json');
const comments = require('./examplecomments.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });
  await Posts.bulkCreate(posts, {
    individualHooks: true,
    returning: true,
  });
  await Comments.bulkCreate(comments, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
