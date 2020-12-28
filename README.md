# Setup dependencies
```
yarn or npm install
```

# Setup env
```
NODE_ENV=development
PRIVATE_KEY=n@e#w$f%a^r&m*m(e)m_o+r1i2z3e4567890
PRIVATE_HASH_KEY=$2b$10$OCSYVJ2HwOQ5iDA/U7ZjreK3OEdUzoCclByN0MPOkxy9UwPrJSW8m
MONGO_URI=mongodb://localhost:27017/memorize
```

# Reset database
```
db.articleactions.deleteMany({})
db.commentactions.deleteMany({})
db.articles.deleteMany({})
db.users.deleteMany({})
db.comments.deleteMany({})
```

# Docker
```
# build image
docker build --no-cache -t lertumpai/memorize-backend .

# run application
docker run --rm --name memorize -p 3000:3000 lertumpai/memorize
```
