const router = require('express').Router();
const { Comment } = require('../../M');
const withAuth = require('../../utils/auth');

router.post('/:id', withAuth, async (req,res) => {
    try {

        const NewComment = await Comment.create({
            ...req.body,
              user_id: req.session.user_id,
              post_id: req.params.id
        })
        
        res.status(200).json(NewComment);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router