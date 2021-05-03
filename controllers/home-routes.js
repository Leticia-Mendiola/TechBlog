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

// GET one painting
router.get('/painting/:id', async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
  if (!req.session.loggedIn) {
    res.redirect('/login');
  } else {
    // If the user is logged in, allow them to view the painting
    try {
      const dbPaintingData = await Painting.findByPk(req.params.id);

      const painting = dbPaintingData.get({ plain: true });

      res.render('painting', { painting, loggedIn: req.session.loggedIn });
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
