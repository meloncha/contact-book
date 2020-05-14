// routes/home.js

const express = require('express');
const router = express.Router();
// express.Router()를 사용해서 router 함수를 초기화합니다.

// Home
router.get('/', (req, res) => {
    // app.get 에서 router.get 으로 바뀐 것만 빼면 이전 코드와 동일
    // "/"에 get 요청이 오는 경우를 router 함수에 설정해준다.
    res.redirect('/contacts');
});

module.exports = router;
// module.exports에 담긴 object(여기서는 router object)가 module이 되어 require시 사용된다.
