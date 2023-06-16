import nodemailer from 'nodemailer'
import { emailCredentials } from '../environment'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: emailCredentials,
})
