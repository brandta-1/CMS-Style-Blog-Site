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

            const commPostDataTitles = Object.values(commPostData).map(i => i.title)

            user.comments = user.comments.map((i, j) => (
                {
                    ...i,
                    title: commPostDataTitles[j]
                }
            ));
        }

        console.log(user);
        res.render('dashboard', user);

    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/profile');
        return;
      }
    res.render('login');
})

module.exports = router;




