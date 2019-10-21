# Bootcamp Challenge 3

### This challenge is a full CRUD backend

#### It's a backend of Academy system.

1. Registry Student's
2. Plans of Registry CRUD
3. CheckIns Admnistration
4. Help Orders to Students get Answer from Admin

### Some explanations bellow...

##### JWT is a web token unique, using a md5 secret, is responsable to sessions autentication.
###### The web token contains info datas about the user, on this case, the id
###### If the token be modified or expired, the session end's

##### Yup is used to verify input's data on routes requests
###### Yup makes a data verify easily

It was used to middlewares in routes what required authentication

The middleware search for a Token on Headers and verify if is valid

##### Creating plans to registry

# GoStack 9.0
