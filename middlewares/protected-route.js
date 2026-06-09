import { verifyToken } from "../token-verification.js";

export async function protectedRoute (req, res, next) {
    const authHeader = req.headers.authorization;

    const token = authHeader.split(" ")[1];

    try{
        const verifiedUser = await verifyToken(token);
        req.user = verifiedUser;
        next();
    } catch (err){
        console.log("Auth Error", err.message);
        return res.status(403).send({error: 'Invalid or expired token'});
    }
};