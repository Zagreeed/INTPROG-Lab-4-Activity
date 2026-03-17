const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cors = require("cors")



const app = express()
const PORT = 3000
const SECRET_KEY = "DANLEY-YAP-GALAN-MARCH-31-2004"


app.use(cors({
    origin: ["http://http://127.0.0.1:5500"]
}))


app.use(express.json())


let users = [
    {
        id: 1,
        firstname: "admin",
        lastname: "user",
        email: "admin@example.com",
        password: "$2b$10$aPbnWecBMzkQdNlVoNRIouuFU3o/F6Klg4v1.FIEhb.VOE7q98XdC",
        role: "admin"
    },
    {
        id: 2,
        firstname: "alice",
        lastname: "go",
        email: "user@email.com",
        password: "$2b$10$jg1uY57jx7pPMcyap0e6yeyb3HpkISic2RXQq1KCj73nUI.P.t23i",
        role: "user"
    }
]



/// AUTH ROUTES 


// REGISTER ROUTE
app.post("/api/register", async (req, res) => {
    const { username, password, role = "user" } = req.body

    if (!username || !password) {
        return res.status(409).json({ error: "Username and Password required" })
    }

    const user = users.find(u => u.username === username)

    if (user) {
        return res.status(409).json({ error: "User already exists!" })
    }

    const hashPassword = bcrypt.hash(password, 10)
    const newUser = {
        id: users.length + 1,
        username,
        password: hashPassword,
        role
    }

    users.push(newUser)
    return res.status(201).json({ message: "User Created Successfully!" })

})



// LOGIN ROUTE
app.post("/api/login", async (req, res) => {
    const { username, password } = req.body


    const user = users.find(u => u.username === username)

    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: "Invalid Credentials" })
    }


    const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        SECRET_KEY,
        { expiresIn: "1h" }
    )


    return res.status(200).json({ token, user: { username: user.username, role: user.role } })

})





// PROTECTED ROUTES
app.get("/api/profile", authenticateToken, async (req, res) => {
    res.json({ user: req.user })
})


app.get("/api/admin/dashbaord", authenticateToken, authorizeRole("admin"), (req, res) => {
    res.json({ message: "Welcome to admin DashBaord", data: "Secret admin info" })
})


// PUBLIC ROUTE
app.get("/api/content/guest", (req, res) => {
    res.status(200).json({ message: "Public content all visitors" })
})




/// MIDDLEWARES

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({ error: "Access Token Required" })
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid or expire token" })

        req.user = user

        next()
    })
}


function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: "Access denied: Insufficient Permission" })
        }

        next()
    }
}















app.listen(PORT, () => {
    console.log(`BACKEND RUNNING ON http://localhost:${PORT}`)
    console.log("_______Try loggging in with:_______")
    console.log("   --Admin: USERNAME: admin,     PASSWORD: Admin123")
    console.log("   --User:  USERNAME: alice,     PASSWORD: user123")
})