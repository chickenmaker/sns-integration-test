var express = require('express');
var router = express.Router();
let ig = require('instagram-node').instagram();
let passport = require('passport');
let https = require('https');
ig.use({
    client_id: 'c339e511332c4fb2958a0a6b58f644b4',
    client_secret: 'a704194292cf4ad894ba58de1f09a740'
})

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/login');
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.get('/userinfo', (req, res, next) => {
    var instaData = req.session.instaClientInfo
    res.render('userinfo', {
        instaClientInfo: instaData,
        facebookClientInfo : req.user
    });
});

router.get('/auth/callback/naver', (req, res, next) => {
    res.render('auth-naver-callback');
})

router.get('/auth/callback/naver/redirect', (req, res, next) => {
    console.log(req.query);
})

router.get('/auth/instagram', (req, res, next) => {

    res.redirect(ig.get_authorization_url('http://127.0.0.1:3000/auth/callback/instagram'));
});

router.get('/auth/callback/instagram', (req, res, next) => {


    ig.authorize_user(req.query.code, 'http://127.0.0.1:3000/auth/callback/instagram', (err, result) => {
        if (err) {
            console.log(err);
            console.error('err :', err.body);
            // res.send('something wrong...');
        } else {
            console.log(result);
            req.session.instaClientInfo = result;
            res.redirect('/userinfo');
        }
    });
});

router.get('/auth/callback/facebook', passport.authenticate('facebook',{successRedirect:'/userinfo', failuserRedirect:'/login'}));

router.get('/auth/facebook',passport.authenticate('facebook'));
module.exports = router;
