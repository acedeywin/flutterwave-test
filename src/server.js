import express from "express"
import useRoute from "./main.js"

const server = async () => {
  const app = express()
  const PORT = process.env.PORT || 6500

  app.use(express.urlencoded({ extended: false }))

  app.use("/", useRoute)

  app.use((err, req, res, next) => {
    //This check for invalid JSON parsed
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      res.statusCode = 400
      res.setHeader("Content-Type", "application/json")
      res.json({
        message: `Invalid JSON payload passed.`,
        status: "error",
        data: null,
      })
    }
    next()
  })

  app.listen(PORT, () => {
    console.log(`Serving is running on ${PORT}`)
  })
}

server().catch(err => console.log(err))
