import { Router } from "express";
import { checkSchema, validationResult, matchedData } from "express-validator";
import { loginValidationSchema } from '../utils/validationSchemas.mjs';
import { User } from '../mongoose/schemas/user.mjs'; // Adjust the path as necessary

const router = Router();


router.post("/api/users",
    checkSchema(loginValidationSchema),async (req, res) => {

    console.log("Creating user with data:", req.body);

    const result = validationResult(req);
    console.log("Validation result:", result);
    if (!result.isEmpty()) return res.send(result.array());
    const data = matchedData(req);
    const newUswer = new User(data)
    console.log("Creating user with data:", req.body);
    try {
        const saveUser =await newUswer.save();
        return res.status(201).send(saveUser);
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(400).send({ error: "Internal Server Error" });
    }
  }
);
router.post("/api/login",checkSchema(loginValidationSchema),async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ result: result.array() });
    }
    const data = matchedData(req);
    // Handle login logic here
    const userName = data.userName;
    const findUser = await User.findOne({ userName});
    if (!findUser) {
      return res.status(401).send({ error: "User not found" });
    }

    console.log("User found:", findUser.password);

    if (findUser.password !== data.password) {
      return res.status(401).send({ error: "Incorrect password" });
    }
    // If login is successful, you can set session or token here
    //req.session.user = findUser; // Store user in session
    return res.status(200).send({ message: "Login successful", });
  }
);

export default router;