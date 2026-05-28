const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../services/dynamodb.js");

const USERS_TABLE = process.env.DYNAMODB_USERS_TABLE || "OrbitUsersTable";
const JWT_SECRET = process.env.JWT_SECRET;

// ================= REGISTER CONTROLLER =================
exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check if user already exists (Standard JS Object Key syntax)
    const checkParams = {
      TableName: USERS_TABLE,
      Key: { email: normalizedEmail }
    };
    
    const { Item } = await docClient.send(new GetCommand(checkParams));
    if (Item) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    // 2. Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Write New Record
    const putParams = {
      TableName: USERS_TABLE,
      Item: {
        email: normalizedEmail,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      }
    };
    await docClient.send(new PutCommand(putParams));

    return res.status(201).json({ message: "User account created successfully." });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: "Failed to process registration." });
  }
};

// ================= LOGIN CONTROLLER =================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Fetch User
    const getParams = {
      TableName: USERS_TABLE,
      Key: { email: normalizedEmail }
    };
    
    const { Item: userRecord } = await docClient.send(new GetCommand(getParams));
    if (!userRecord) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // 2. Validate Password Hash
    const isPasswordValid = await bcrypt.compare(password, userRecord.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // 3. Generate Stateless JWT Access Token
    const token = jwt.sign(
      { email: userRecord.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({ 
      token, 
      email: userRecord.email,
      message: "Authentication successful." 
    });
  } catch (err) {
    console.error("Login database error:", err);
    return res.status(500).json({ error: "Authentication system failure." });
  }
};

