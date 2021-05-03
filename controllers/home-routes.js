const router = require('express').Router();
const { Posts, Comments } = require('../models');

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

router.get('/posts/:id', async (req, res) => {
  if (!req.session.loggedIn) {
    res.redirect('/login');
  } else {
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
  }
});

//Post New Post
router.post('/', async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
  if (!req.session.loggedIn) {
    res.redirect('/login');
  } else {
    // If the user is logged in, allow them create new post
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
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
