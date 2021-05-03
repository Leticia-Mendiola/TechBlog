const router = require('express').Router();
const { Posts, Comments } = require('../models');
const withAuth = require('../utils/auth');

//View all posts when on the homepage
router.get('/', async (req, res) => {
  try {
    const dbPostsData = await Posts.findAll({
      include: [
        {
          model: Posts,
          attributes: ['post_title', 'username', 'post_date', 'post_body'],
        },
      ],
    });

    const posts = dbPostsData.map((posts) =>
      posts.get({ plain: true })
    );

    res.render('homepage', {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//When you click on a post, you can then view comments. Must be logged in to view comments
router.get('/posts/:id', withAuth, async (req, res) => {
  try {
    const dbPostsData = await Posts.findByPk(req.params.id, {
      include: [
        {
          model: Posts,
          attributes: [
            'id',
            'posts_title',
            'username',
            'post_date',
            'post_body',
          ],
        },
        {
          model: Comments,
          attributes: [
            'id',
            'username',
            'post_date',
            'post_body',
          ],
        }
      ],
    });
    const posts = dbPostsData.get({ plain: true });
    res.render('posts', { posts, loggedIn: req.session.loggedIn });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//Post a new post on the homepage. Must be logged in to post.
router.post('/', withAuth, async (req, res) => {
  try {
    const postData = await Posts.create({
      post_title: req.body.post_title,
      username: req.body.username,
      post_date: req.body.post_date,
      post_body: req.body.post_body,
    });
    res.status(200).json(postData)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//When viewing an individual post, post a new comment. Must be logged in.
router.post('/posts/:id', withAuth, async (req, res) => {
  try {
    const postData = await Comments.create({
      username: req.body.username,
      comment_date: req.body.comment_date,
      comment_body: req.body.comment_body,
    });
    res.status(200).json(postData)
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//directs to login page if not logged in
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
