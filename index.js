const express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const config = require("./config/key");

const { User } = require("./models/User");

//application/x-www-form-urlencoded 타입의 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));

//application/json 타입의 데이터를 분석해서 가져옴
app.use(bodyParser.json());

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
mongoose
  .connect(config.mongoURI, {})
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!새해 복 많이많이");
});

app.post("/register", (req, res) => {
  //회원 가입 할 때 필요한 정보들을 client에서 가져오면
  //그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/login', (req, res) => {
  
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    // 요청된 이메일을 가진 user가 한명도 없는 경우
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    // 요청된 이메일을 가진 user가 있는 경우
    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
    //isMatch메서드는 User.js에 만든다.
    user.comparePassword(req.body.password, (err, isMatch) => {
      //비밀번호가 같지 않다면
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
      
        //비밀번호까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        
      })

    })



  
  })



})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
