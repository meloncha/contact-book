/*
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
//mongoose.connect('CONNECTION_STRING') 함수를 사용해서 DB를 연결할 수 있다.
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


//index.js 2
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
//body-parser module
let app = express();

// DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGO_DB);
let db = mongoose.connection;

db.once('open', () => {
    console.log('DB connected');
});

db.on('error', (err) => {
    console.log('DB ERROR : ', err);
});

// Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // json 형식의 데이터를 받는다는 설정
// 이렇게 처리를 해줘야 웹 브라우저의 form에 입력한 데이터가 
// bodyParser를 통해 req.body로 생성이 된다.
app.use(bodyParser.urlencoded({extended:true}));
// urlencoded data를 extended 알고리즘을 사용해서 분석하는 설정

// DB schema
let contactSchema = mongoose.Schema({ 
    // DB에 정보를 어떠한 형식으로 저장할 지를 지정해 주는 부분
    // contact라는 형태의 데이터를 저장하는데 이 contact는 name, email, phone의 
    // 항목들을 가지고 있으며 새 항목 모두 String 타입이다.
    name:{type:String, required:true, unique:true},
    // name은 반드시 값이 입력되어야 하며 (require:true) 
    //값이 중복되면 안된다(unique:true)는 추가 설정이 있다.
    email:{type:String},
    phone:{type:String},
});
let Contact = mongoose.model('contact', contactSchema);
//mongoose.modal 함수를 사용하여 contact schema의 model을 생성한다
//첫번째 parameter는 mongoDB에서 사용되는 콜렉션의 이름이며,
//두번째는 mongoose.Schema로 생성된 오브젝트이다.
//DB에 있는 contact라는 데이터 콜렉션을 현재 코드의 Contact라는 변수에 연결해 주는 역할
//DB에 콜렉션이 없는 경우 Mongoose가 없는 콜렉션을 알아서 생성한다.


// Routes
// Home
app.get('/', (req, res) =>{ 
    // '/'에 get요청이 오는 경우 : /contact로 redirect 하는 코드
    res.redirect('/contacts');
});
// Contacts - Index
app.get('/contacts', (req, res) => {
    // '/contacts'에 get 요청이 오는 경우 :
    // 에러가 있다면 에러를 json형태로 웹 브라우저에 표시,
    // 에러가 없다면 검색 결과를 받아 views/contacts/index.ejs를 
    // render(페이지를 다이나믹하게 제작)한다.
    Contact.find({}, (err, contacts) => {
        //모델.find(검색조건, callback_function)으로 나타낼 수 있다.
        //모델.find 함수는 DB에서 검색조건에 맞는 모델 data를 찾고 콜백_함수를 호출하는 함수
        //모델.find의 검색조건은 Object형태롤 전달되는데 빈 Object({})를 전달하는경우
        //(=검색조건 없음) DB에서 해당 모델의 모든 data를 return한다.
        //모델.find의 콜백_함수는 function(에러, 검색결과)의 형태이다.
        //첫번째 parameter인 에러(err)는 error가 있는 경우에만 내용이 전달됩니다.
        //if(err)로 에러가 있는지 없는지를 알 수 있다. 두번째 parameter인 검색결과(contact)는
        //한 개 이상일 수 있기 때문에 검색결과는 항상 array이며 심지어 검색 결과가 없는 경우에도
        //빈 array []를 전달한다. 검색결과가 array임을 나타내기 위해 parameter이름으로 
        //contact의 복수형인 conatacts를 사용한다.
        if(err) return res.json(err);
        res.render('contacts/index', {contacts:contacts});
    });
});
// Contacts - New
app.get('/contacts/new', (req, res)=>{
    //'/contacts/new'에 get요청이 오는 경우 :
    // 새로운 주소록을 만드는 form이 있는 veiws/contacts/new.ejs를 render 합니다.
    res.render('contacts/new');
});
// Contacts - create
app.post('/contacts', (req, res)=>{
    //'/contacts'에 post요청이 오는 경우 : '/contacts/new' 에서 폼을 전달받는 경우이다.
    Contact.create(req.body, (err, contact)=>{
        //모델.create는 DB에 data를 생성하는 함수. 첫 번째 parameter로 error를 받고 
        //두번째 parameter로 콜백 함수를 받습니다. 생성된 data는 항상 하나이므로
        //parameter이름으로 단수형인 contact를 사용
        if(err) return res.json(err);
        res.redirect('/contacts');
        //에러없이 contact data가 생서되면 /contact로 redirect한다.
    });
});

//Port setting
let port = 3000;
app.listen(port, () => {
    console.log('Server on! http://localhost:' + port);
});
*/

// index.js 3
let express = require('express');
let mongoose = require('mongoose');
let bodyparser = require('body-parser');
let methodOverride = require('method-override');
//method-override module을 methodOverride변수에 담습니다.
let app = express();

//DB setting
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.MONGO_DB);
let db = mongoose.connection;

db.once('open', () => {
    console.log('DB connected');
});

db.on('error', err => {
    console.log('DB ERROR : ', err);
});

//Other settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
//_method의 query로 들어오는 값으로 HTTP method를 바꿉니다.
//http://example.com/category/id?_method=delete를 받으면 _method의 값이 delete를 읽어
//해당 request의 HTTP method를 delete로 바꿉니다.

// DB schema
let contactSchema = mongoose.Schema({
    name:{type:String, required:true, unique:true},
    email:{type:String},
    phone:{type:String},
});
let Contact = mongoose.model('contact', contactSchema);

// Routes
// Home
app.get('/', (req, res) => {
    res.redirect('/contacts');
})
// Contacts - Index
app.get('/contacts', (req, res) => {
    Contact.find({}, (err, contacts) => {
        if(err) return res.json(err);
        res.render('contact/index', {contacts:contacts});
    });
});
// Contacts - New
app.get('/contacts/new', (req, res) => {
    res.render('contacts/new');
});
// Contacts - create
app.post('/contacts', (req,res)=> {
    Contact.create(req.body, (err, contact) => {
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});
// Contacts - show
app.get('/contacts/:id', (req,res) => {
    // "/contacts/:id"에 get요청이 오는 경우
    // :id처럼 route에 콜론(:)을 사용하면 해당 위치의 값을 받아 req.params에 넣게 된다.
    // 예를 들어 "contacts/abcd1234"가 입력되면 "contact/:id" route에서 이를 받아
    // req.params.id에 "abcd1234"를 넣게 된다.
    Contact.findOne({_id:req.params.id}, (err, contact) => {
        //Model.findOne은 DB에서 해당 model의 document를 하나 찾는 함수입니다. 첫번째 parameter로
        //찾을 조건을 object로 입력하고 data를 찾은 후 콜백 함수를 호출합니다.
        //Model.find 와 비교해서 Model.find는 조건에 맞는 결과를 모두 찾아 array로 전달하는 데 비해
        //Model.findOne은 조건에 맞는 결과를 하나 찾아 Object로 전달합니다. (검색 결과가 없다면 null이 전달됩니다.)
        //위 경우 DB의 contacts collection에서 _id가 req.params.id와 일치하는 data를 찾는 조건
        if(err) return res.json(err);
        res.render('contacts/show', {contact:contact});
        //에러가 없다면 검색 결과를 받아 views/contacts/show.ejs를 render합니다.
    });
});
// Contacts - edit
app.get('/contacts/:id/edit', (req, res) => {
    // "contacts/:id/edit" 에 get 요청이 오는 경우 :
    Contact.findOne({_id:req.params.id}, (err, contact) => {
        if(err) return res.json(err);
        res.redirect('/contacts/edit' + req.params.id);
        //Model.findOne이 다시 사용되었습니다. 검색결과를 받아 views/contacts/edit.ejs를 render합니다.
    });
});
// Contacts - update
app.put('/contacts/:id', (req, res) =>{
    // "contacts/:id"에 put 요청이 오는 경우 
    Contact.findOneAndUpdate({_id:req.params.id}, req.body, (err, contact) => {
        if(err) return res.json(err);
        res.redirect('/contacts/' + req.params.id);
    });
});
// Contacts - destroy
app.delete('/contacts/:id', (req, res) => {
    Contact.deleteOne({_id:req.params.id}, err => {
        if(err) return res.json(err);
        res.redirect('/contacts');
    });
});

//Port setting
let port = 3000;
app.listen(port, () => {
    console.log('Server on! http://localhost:' + port);                                                                                                                ')
});