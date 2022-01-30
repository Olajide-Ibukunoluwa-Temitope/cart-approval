# Getting Started

1. clone project on your local machine
2. run yarn or npm install depending on whichever one you typically use to install all required packages
3. run yarn dev or npm run dev to run app on local machine

## Side Note
In this project I used `https://dummyjson.com/docs/carts/` api instead of the one provided primarily because it is very similar to the one provided and it provides a bit more information in its response. I also noticed that the `https://fakestoreapi.com/docs` which was what was instructed to be used had repeated users in its response when fetching for carts, so for example it would return 5 carts where userIds were repeated which suggested it wasn't 5 different carts from different users.

As you'll see in my code `https://dummyjson.com/docs/carts/` was a suitable substitute