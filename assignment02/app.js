let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session')

app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


let users = new Array();
users[0] = {
	"userId" : 0,
	"name" : "jin",
	"password" : "abc",
	"isAdmin" : true
}

app.put('/login', (req, res) => {
	// users 배열에서 찾도록 처리 해야 함
	// admin 여부를 확인하여 체크
	// req.body.id : ID
	// req.body.name : 패스워드
	if(users.find( v => (v.userId == req.body.userId && v.password == req.body.password) )){
		req.session.userId = req.body.userId;
		req.session.isAdmin = users[req.body.userId].isAdmin
		req.session.save();
		res.send("Login");
	}
	else{
		res.send("Login Failed");
	}
});

app.put('/logout', (req, res) => {
	// Logout
	// 세션 유효 여부를 체크하고 세션 Delete
	if (req.session.userId != null){
		req.session.destroy();
		res.send("LogOut");
	}
	else{
		res.send("not logged in")
	}
});

let auth = (req, res, next) => {
	// Session Check
	// 어드민 여부 체크 필요
	if (req.session.userId != null  && req.session.isAdmin == true)
		next();
	else
		res.send("Error");
};
app.get('/user/:userId', auth, (req, res) => {
	// get User Information
	let userId = req.params.userId;
	res.send(users[userId]);
});

app.put('/user', auth, (req, res) => {
	// update User Information
	users[req.body.userId] = {
		"userId" : req.body.userId,
		"name" : req.body.name,
		"password" : req.body.password,
		"isAdmin" : req.body.isAdmin
	}
	res.send(users[req.body.userId]);
});

app.post('/user', auth, (req, res) => {
	// write User Information
	users[req.body.userId] = {
		"userId" : req.body.userId,
		"name" : req.body.name,
		"password" : req.body.password,
		"isAdmin" : req.body.isAdmin
	}
	res.send(users[req.body.userId]);
});

app.delete('/user/:userId', auth, (req, res) => {
	// delete User Information
	let userId = req.params.userId;
	delete users[userId];
	res.send("OK");
});
// 사용자 추가 시에 admin 여부도 추가해야 함

let server = app.listen(23023);
