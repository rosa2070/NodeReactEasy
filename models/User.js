const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //이메일 안 스페이스바 없애주는 역할
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//usermodel에 정보를 저장하기 전에 무언가를 한다.
userSchema.pre("save", function (next) {
  //this는 User.js의 schema부분을 가리킴
  var user = this;

  //password가 변환된 때만 암호화 해줌
  if (user.isModified("password")) {
    //비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      //에러가 나면 바로 user.save로 이동
      if (err) return next(err);

      //user.password는 암호화 전 비밀번호, hash는 암호화된 비밀번호
      bcrypt.hash(user.password, salt, function (err, hash) {
        //에러 나면 user.save로 돌려보냄
        if (err) return next(err);
        //암호화된 비밀번호 만드는데 성공하면 비밀번호를 hash로 교체
        user.password = hash;
        //next를 통해 index.js에 있는 user.save로 이동
        next();
      });
    });
  } else {
    next()
  }
})

userSchema.methods.comparePassword = function (plainPassword, cb) {
  
  //plainPassword 1234567         암호화된 비밀번호 $2b$10$lKPmVfw8.rX1nInu8c10W.FqYH3tu6xMbUXdcdkh9QSkJ0VjSvxA2
  //plainPassword를 암호화한 후 db에 있는 비밀번호와 같은지 확인하여야 한다.
  //this는 userSchema를 의미
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    // 비밀번호가 같지 않다.
    if (err) return cb(err),
    // 비밀번호가 일치한다.
    // null은 에러가 없음을 의미
    // isMatch 값은 true이다.
    cb(null, isMatch)

  })
}

//Schema를 model로 감싸준다. 매개변수 User는 모델이름, userSchema는 Schema를 의미
const User = mongoose.model("User", userSchema);

//모델을 다른 곳에서도 쓸수있게 export
module.exports = {
  User,
};
