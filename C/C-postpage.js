const router = require('express').Router();
const { Post, User, Comment } = require('../M');
const withAuth = require('../utils/auth');

router.get('/:id', withAuth, async (req, res) => {

    try {
        //get the post and its user, and its comments and their users
        const postData = await Post.findByPk(req.params.id, {
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

        const post = postData.get({ plain: true });

        const owner = Boolean(post.user_id == req.session.user_id);

        //check if the post owner also owns any other comments
        post.comments = post.comments.map((i) => ({
            ...i,
            isOwner: Boolean(i.user_id == req.session.user_id)
        }))

        res.render('postpage', { ...post, owner, logged_in: req.session.logged_in });

    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;