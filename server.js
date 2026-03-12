const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")



const appp = express()
const PORT = 3000
const SECRET_KEY = "DANLEY-YAP-GALAN-MARCH-31-2004"


appp.listen(PORT, ()=>{
    console.log(`BACKEND RUNNING ON http://localhost:${PORT}`)
    console.log("_______Try loggging in with:_______")
    console.log("   --Admin: USERNAME: admin,     PASSWORD: Admin123")
    console.log("   --User:  USERNAME: alice,     PASSWORD: user123")
})