const express = require('express')
const router = express.Router()

const { addReview, deleteReviewByUserId, getReviewByProductId } = require("../Controllers/ReviewController")

router.post("/", addReview)

router.get("/:productId", getReviewByProductId)

router.delete("/:productId", deleteReviewByUserId)

module.exports = router;