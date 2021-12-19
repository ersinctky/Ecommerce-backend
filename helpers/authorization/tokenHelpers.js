const sentJwtToClient = (user, res) => {
  // generate jwt
  const token = user.generateJwtFromUser();
  const { JWT_COOKIE, NODE_ENV } = process.env;
  return res.status(200).json({
    success: true,
    access_token: token,
    data: {
      name: user.name,
      email: user.email,
    },
  });
  //response
};

const isTokenIncluded = (req) => {
  return (
    req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
  );
};
const getAccessTokenFromHeader = (req) => {
  const authorization = req.headers.authorization;
  const access_token = authorization.split(" ")[1];
  return access_token;
};

export { sentJwtToClient, isTokenIncluded, getAccessTokenFromHeader };
