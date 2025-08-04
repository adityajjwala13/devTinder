# DevTinder APIS

## authRouter

- POST/signup
- POST/login
- GET /Logout

## profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/editPassword

## connectionRequestRouter

- POST/request/send/interested/:userId
- POST/request/send/ignored/:userId
- POST/request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

## userRouter

- GET /user/requests/received
- GET/user/connections
- GET /user/feed - Gets you the profiles of other users on platform

# Status: ignored, interested, accepeted, rejected
