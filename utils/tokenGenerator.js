const crypto = require("crypto");
const { getSecretFromDB } = require("./mockDb");

const generateToken = async (email) => {
  try {
    const secret = await getSecretFromDB();

    return crypto.createHmac("sha256", secret).update(email).digest("base64");
  } catch (error) {
    console.error("Token generation failed:", error.message); //  Log it
    throw error; //  Re-throw so caller knows it failed
  }
};

module.exports = { generateToken };

/*  
This generateToken function is designed but not used in the current server implementations.
how it can be used -
const crypto = require("crypto");
const { getSecretFromDB } = require("./mockDb");

 * 
 * POTENTIAL USE CASES:
 * 1. API Key Generation: Generate persistent API keys for users
 *    Example: const apiKey = await generateToken(user.email);
 * 
 * 2. Email Verification Tokens: Create secure tokens for email confirmation
 *    Example: const verificationToken = await generateToken(user.email + Date.now());
 * 
 * 3. Password Reset Tokens: Generate one-time tokens for password recovery
 *    Example: const resetToken = await generateToken(user.email + user.passwordHash);
 * 
 * HOW TO USE (if needed):
 
 * // In server.js, after successful login:
 * const apiKey = await generateToken(session.email);
 * 
 * // Store it with the user session:
 * loginSessions[loginSessionId] = {
 *   email,
 *   password,
 *   apiKey,  // Add this
 *   createdAt: Date.now(),
 *   expiresAt: Date.now() + 2 * 60 * 1000,
 * };
 * 
 * // Return it in response:
 * return res.status(200).json({
 *   message: "OTP sent",
 *   loginSessionId,
 *   apiKey  // Client can use this for subsequent requests
 * });
 
 * 
 * PREREQUISITE:
 * Must set APPLICATION_SECRET environment variable:
 * export APPLICATION_SECRET="your-secret-key-here"
 * 
 * @param {string} email - User's email address
 * @returns {Promise<string>} Base64-encoded HMAC token
 * @throws {Error} If APPLICATION_SECRET is missing or token generation fails
 

*/
