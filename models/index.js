const User = require('./User');
const Posts = require('./Posts');
const Comments = require('./Comments');

Posts.hasMany(Comments, {
  foreignKey: 'posts_id',
});

Comments.belongsTo(Posts, {
  foreignKey: 'posts_id',
});

module.exports = { User, Posts, Comments };
