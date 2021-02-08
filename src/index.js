import express from "express"
import useRoute from "./main.js"

const app = express()
const PORT = process.env.PORT || 6500

app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use((err, req, res, next) => {
  //This check for invalid JSON parsed
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: `Invalid JSON payload passed.`,
      status: "error",
      data: null,
    })
  }
  next()
})

app.use("/", useRoute)

app.listen(PORT, () => {
  console.log(`Serving is running on ${PORT}`)
})
