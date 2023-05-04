const router = require('express').Router();
const { Post, User, Comment } = require('../M');
const withAuth = require('../utils/auth');

router.get('/:id', withAuth, async (req,res) => {

    try {
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

        //TODO replace 3 with req.session.user_id
        const owner = Boolean(post.user_id == req.session.user_id);

        post.comments = post.comments.map((i) => ({
            ...i,
            isOwner: Boolean(i.user_id == req.session.user_id)
        }))

        res.render('postpage' , {...post, owner} );

        console.log(post);

    } catch (err) {
        res.status(500).json(err);
    }

    
});



module.exports = router;