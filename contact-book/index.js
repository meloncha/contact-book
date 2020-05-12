//index.js

let express = require('express');
let mongoose = require('mongoose');
let app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//mongoose의 몇몇 글로벌 설정을 해주는 부분. 빠지면 서버 실행시 경고

mongoose.connect(process.env.MONGO_DB);
//node.js에서 기본으로 제공되는 process.env 오브젝트는 환경변수들을 가지고 있는 객체
//mongoose.conect('CONNECTION_STRING') 함수를 사용해서 DB를 연결할 수 있다.
let db = mongoose.connection;
//mongoose의 db object를 가져와 db변수에 넣는 과정
//이 db변수에는 DB와 관련된 이벤트 리스너 함수들이 있다.

db.once('open', () => {
    console.log('DB connected');
    //db가 성공적으로 연결된 경우 "DB connected"를 출력
});

db.on('error', (err) => {
    console.log('DB ERROR : ', err);
    //db연결 중 에러가 있는 경우 "DB ERROR : " 와 에러를 출력
});
// DB 연결은 앱이 실행되면 단 한번만 일어나는 이벤트
// 그러므로 db.once('이벤트_이름', 콜백_함수) 함수를 사용
//error는 DB접속시 뿐만아니라 다양한 경우에 발생할 수 있기 때문에
//db.on('이벤트_이름', 콜백_함수) 함수를 사용한다.

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// Port setting
let port = 3000;
app.listen(port, () => {
    console.log('server on! http://localhost:' + port);
});
