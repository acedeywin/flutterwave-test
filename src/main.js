import express from "express"
import bodyParser from "body-parser"

const useRoute = express.Router()
useRoute.use(bodyParser.json())

//the base route
useRoute.get("/", (req, res) => {
  const profile = {
    name: "Stephen Okpalaononuju",
    github: "@acedeywin",
    email: "stephenokpala@gmail.com",
    mobile: "08065467341",
    twitter: "@acedeywinn",
  }

  res.statusCode = 200
  res.setHeader("Content-Type", "application/jsn")
  res.json({
    message: "My Rule-Validation API",
    status: "success",
    data: profile,
  })
})

//the rule validation route
useRoute.post("/validate-rule", (req, res, next) => {
  let {
    rule: { field, condition, condition_value },
  } = req.body

  let {
    data: { dataToValidate },
  } = req.body

  const errors = []
  const validationError = []
  const fieldValue = req.body.rule.field
  const dataToValidateValues = Object.values(dataToValidate)
  const dataToValidateKeys = Object.keys(dataToValidate)

  if (field == "dataToValidate") {
    field = dataToValidate
  } else if (field == `dataToValidate.${dataToValidateKeys[0]}`) {
    field = dataToValidateValues[0]
  } else {
    errors.push(`field ${field} is missing from data`)
  }

  if (!fieldValue) {
    errors.push(`field is required.`)
  }
  if (!condition) {
    errors.push(`condition is required.`)
  }
  if (!condition_value) {
    errors.push(`condition_value is required.`)
  }
  if (isNaN(condition_value)) {
    errors.push(`condition_value should be a number.`)
  }
  if (!dataToValidate) {
    errors.push(`dataToValidate is required.`)
  }
  if (typeof dataToValidate != "object" && isNaN(dataToValidate)) {
    errors.push(`dataToValidate should be a number or an object.`)
  }
  if (errors.length > 0) {
    res.statusCode = 400
    res.setHeader("Content-Type", "application/json")
    res.json({
      message: errors[0],
      status: "error",
      data: null,
    })
  }

  if (condition == "eq" && field !== condition_value) {
    validationError.push(`field ${fieldValue} failed validation.`)
  }
  if (condition == "neq" && field === condition_value) {
    validationError.push(`field ${fieldValue} failed validation.`)
  }
  if (condition === "gt" && field <= condition_value) {
    validationError.push(`field ${fieldValue} failed validation.`)
  }
  if (condition == "gte" && field < condition_value) {
    validationError.push(`field ${fieldValue} failed validation.`)
  }
  if (condition == "contains" && field !== condition_value) {
    validationError.push(`field ${fieldValue} failed validation.`)
  }
  if (validationError.length > 0) {
    res.statusCode = 400
    res.setHeader("Content-Type", "application/json")
    res.json({
      message: validationError[0],
      status: "error",
      data: {
        validation: {
          error: true,
          field: fieldValue,
          field_value: field,
          condition,
          condition_value,
        },
      },
    })
  } else {
    //console.log(dataKeys)
    res.statusCode = 200
    res.setHeader("Content-Type", "application/json")
    res.json({
      message: `field ${fieldValue} successfully validated.`,
      status: "success",
      data: {
        validation: {
          error: false,
          field: fieldValue,
          field_value: field,
          condition,
          condition_value,
        },
      },
    })
  }
})

export default useRoute
