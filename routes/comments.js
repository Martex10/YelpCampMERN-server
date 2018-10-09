const express = require('express');
//this allows us to gain access to id inside of this router
const router = express.Router({mergeParams: true});

const { createComment, getComment, deleteComment } = require("../handlers/comments");

//prefix - /api/users/:id/comments
router.route("/").post(createComment);

//prefix = /api/users/:id/comment/:comment_id
router.route("/:message_id").get(getComment).delete(deleteComment);

module.exports = router; 