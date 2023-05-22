const User = require('../models/users')
const { confirmationMailer } = require('./helpers/mailer')

const PinCodeGenerator = length => {
    const nums = '0123456789';
    let code = new Array(length).fill(null).map( () => nums[Math.floor(Math.random() * nums.length)] ).join("");
    return parseInt(code)
}

const renderIndex = (req, res) => {
    res.render("index");
}
const renderConfirmEmail = (req, res) => {
    res.render("confirmemail");
}
const renderUnsubscribe = (req, res) => {
    res.render("unsubscribe");
}

const HandlePost = async (req, res) => {
    if(req.body.from === "home"){
        const { name, email } = req.body
        const pin = PinCodeGenerator(5)
        try {
            const newUser = new User({ name, email})
            const useSaved = await newUser.save()
            confirmationMailer(email, name, pin)
            console.log('send pin')
            res.cookie("user", name)
            res.cookie("email", email).redirect('/confirmEmail')
        } catch (error) {
            res.status(500).send(`error occured ${error}`)            
        }
        
    }else if(req.body.from === "confirm"){
        const { pin1, pin2, pin3, pin4, pin5 } = req.body
        const userPin = pin1 + pin2 + pin3 + pin4 + pin5
        console.log(userPin)
    }else{
        console.log("request from others")
    }
    console.log(req.body)
}



module.exports = {
    renderIndex,
    renderConfirmEmail,
    renderUnsubscribe,
    HandlePost
}