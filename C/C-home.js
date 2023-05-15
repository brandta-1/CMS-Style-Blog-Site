const router = require('express').Router();
const { Post, User, Comment } = require('../M');
const { Op } = require('sequelize');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {

    try {

        const postData = await Post.findAll({
            include: [
                {
                    model: Comment, as: "comments",
                    include: [{ model: User, as: "user" }]
                },
                {
                    model: User, as: "user"
                }
            ]
        });

        const posts = postData.map((i) => i.get({ plain: true }));

        res.render('homepage', {
            posts,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }

});

router.get('/dashboard', withAuth, async (req, res) => {
    try {

        //get the user's posts
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Post

                },
                {
                    model: Comment
                }
            ]
        });

        let user = { ...userData.get({ plain: true }) };

        //if the user has comments, find the titles of the posts that the comments belongs to
        if (userData.get({ plain: true }).comments.length) {

            //didnt realize sequelize has built-in getters when i wrote this...
            async function titles(x) {

                const theTitle = await Post.findByPk(x, {
                    raw: true,
                    attributes: ['title']
                })

                return theTitle.title
            }

            user.comments = await Promise.all(user.comments.map(async (i) => (
                {
                    ...i,
                    title: await titles(i.post_id)
                }
            )));
        }

        res.render('dashboard', { ...user, logged_in: req.session.logged_in });

    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard');
        return;
    }
    res.render('login');
})

module.exports = router;




