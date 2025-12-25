# API LIST

## authRouter
- POST /signup
- POST /login
- POST /logout

## connectionRequestRouter
- POST /request/send/like/:userId
- POST /request/send/ignore/:userId
- POST /request/status/accepted/:requestId
- POST /request/status/rejected/:requestId

## profileRouter
- GET /profile/view
- PATCH /profile/edit -update profile info
- PATCH /profile/password -update password

## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed - gets u profiles of other users on platform