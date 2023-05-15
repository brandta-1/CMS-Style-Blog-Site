const router = require('express').Router();
const { Model } = require('sequelize');
const { Post, Comment } = require('../../M');
const withAuth = require('../../utils/auth');

router.post('/', withAuth, async (req, res) => {
    try {


        const newPost = await Post.create({
            ...req.body,
            //needs to be session id
            user_id: req.session.user_id
        });

        res.status(200).json(newPost);


    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', withAuth, async (req, res) => {
    try {

      
        let delData = 0;

        if (req.body.objType == "Post") {

            delData = await Post.destroy({
                where: {
                    id: req.params.id
                }
            });

        } else if (req.body.objType == "Comment") {

            console.log("HEEEEEEEEEEELP")
          
            delData = await Comment.destroy({
                where: {
                    id: req.params.id,
                    //needs to be session id
                    user_id: req.session.user_id
                }
            });

        }

        if (delData == 0) {
            res.status(404).json({ message: `${req.body.objType} ${req.params.id} not found` });
            return;
        }

        res.status(200).json(delData);
    }
    catch (err) {
        res.status(400).json(err)
    }
});


router.put('/:id', async (req, res) => {
    try {

        console.log(req.body)

        let upData = 0;

        if (req.body.objType === "Post") {

            delete req.body.objType;

            upData = await Post.update(req.body, {
                where: {
                    id: req.params.id
                }
            });

        } else if (req.body.objType === "Comment") {

            delete req.body.objType;

            upData = await Comment.update(req.body, {
                where: {
                    id: req.params.id
                }

            });
        }

        if (upData == 0) {
            res.status(404).json({ message: `Update unsuccessful` });
            return;
        }

        res.status(200).json(upData);
    } catch (err) {
        res.status(400).json(err)
    }
})



module.exports = router;