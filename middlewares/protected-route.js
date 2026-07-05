import { verifyToken } from "../utils/token-verification.js";

export async function protectedRoute(req, res, next) {
   const authHeader = req.headers.authorization;

   if (!authHeader) {
      return res.status(401).send({ error: 'Unauthorized user' });
   }

   if (authHeader.startsWith('Bearer ') && authHeader.split(" ").length === 2) {
      const token = authHeader.split(" ")[1];

      try {
         const verifiedUser = await verifyToken(token);
         req.user = verifiedUser;
         next();
      } catch (err) {
         console.log("Auth Error", err.message);
         return res.status(403).send({ error: 'Invalid or expired token' });
      }

   } else {
      return res.status(401).send({ error: "Invalid Authorization format. Expected: 'Bearer '" });
   }
};

