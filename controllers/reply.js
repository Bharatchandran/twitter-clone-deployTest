const Tweet = require('../models/tweet')

module.exports = {
    create,
    delete: deleteReply,
    edit,
    update
}

async function create (req, res) {
    const tweet = await Tweet.findById(req.params.id);
    req.body.user = req.user._id;
    req.body.userName = req.user.name;
    req.body.userAvatar = req.user.avatar;
    tweet.reply.push(req.body)
    
    await tweet.save();
    res.redirect(`/tweets/${tweet._id}`)
}

async function deleteReply(req, res) {
    const tweet = await Tweet.findOne({'reply._id': req.params.id})
    console.log(tweet)
    const tweetId= tweet._id.toString();
    console.log(tweetId)

    tweet.reply.remove(req.params.id)
    await tweet.save();
    console.log(tweet)
    console.log(tweetId)
    res.redirect(`/tweets/${tweetId}`)

}

async function edit (req, res) {
    console.log(req.params.id)
    const tweet = await Tweet.findOne({'reply._id': req.params.id})
    const tweetId= req.params.id.toString();
    const deleteHref = "/tweets"
    const currentUserId = req.user._id
    const view = "index"
    const avatar = req.user.avatar;
    console.log(tweet._id)
    const editPath = "tweets"
    
    let tweetContent = tweet.reply
    const findEl = tweetContent.find(el => el._id.toString() === req.params.id)
    tweetContent = findEl.content
    res.render('tweets/edit',{
        tweet,
        deleteHref,
        currentUserId,
        view,
        title: "Edit",
        avatar,
        editPath,
        tweetId,
        tweetContent
    })
}

async function update(req, res) {
    const tweet = await Tweet.findByIdAndUpdate(req.params.id,req.body)
    const tweetId = tweet._id
    res.redirect(`/tweets/${tweetId}`);
}
