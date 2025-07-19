// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

res.status(200).json({
  token,
  user: {
    id: user._id,
    username: user.username,
    email: user.email
  }
});