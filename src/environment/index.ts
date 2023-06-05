import dotenv from 'dotenv'
dotenv.config()

export const emailCredentials = {
  user: process.env.EMAIL_ADDRESS,
  pass: process.env.PASSWORD,
}
