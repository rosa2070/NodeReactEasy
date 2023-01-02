const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //이메일 안 스페이스바 없애주는 역할
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

//Schema를 model로 감싸준다.
//매개변수 User는 모델이름, userSchema는 Schema를 의미
const User = mongoose.model('User', userSchema)

//모델을 다른 곳에서도 쓸수있게 export
module.exports = { User }