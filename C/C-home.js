const router = require('express').Router();
const { Post, User, Comment } = require('../M');
const { Op } = require('sequelize');
const withAuth = require('../utils/auth');


router.get('/', async (req, res) => {

    try {

        console.log(req.session.logged_in)

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

//TODO: change :id req param placeholder to session id instead
router.get('/dashboard', withAuth, async (req, res) => {
    try {
        //TODO: see above for this line as well
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

        //const commentPosts = await Post.findByPk()

        let user = { ...userData.get({ plain: true }) };

        console.log(user);

        if (userData.get({ plain: true }).comments.length) {

            const commPostData = await Post.findAll({
                raw: true,
                attributes: ['title'],
                where: {
                    id: {
                        [Op.or]: user.comments.map((i) => i.post_id)
                    }
                }
            });


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

        console.log(user);
        res.render('dashboard', {...user, logged_in: req.session.logged_in});

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




