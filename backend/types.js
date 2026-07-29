const zod = require("zod")

const createUser = zod.object({
  username: zod.email(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string()
});

const signinUser = zod.object({
    username: zod.email(),
    password: zod.string()
})

const updateUser = zod.object({
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

module.exports = {
    createUser,
    signinUser,
    updateUser
}