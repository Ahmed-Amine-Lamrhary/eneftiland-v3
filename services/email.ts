import Email from "email-templates"

const email_user = process.env.NEXT_PUBLIC_CONTACT_EMAIL || ""
const email_pass = process.env.NEXT_PUBLIC_CONTACT_PASSWORD || ""
const email_host = process.env.NEXT_PUBLIC_CONTACT_HOST || ""
const email_port: any = process.env.NEXT_PUBLIC_CONTACT_PORT || ""

const emailTemp = new Email({
  message: {
    from: email_user,
  },
  preview: false,
  send: true,
  transport: {
    host: email_host,
    port: email_port,
    auth: {
      user: email_user,
      pass: email_pass,
    },
  },
})

interface sendEmailI {
  template: string
  to: string
  subject: string
  locals: any
}

const sendEmail = async ({ template, to, subject, locals }: sendEmailI) => {
  await emailTemp.send({
    template,
    message: {
      to,
      subject,
    },
    locals,
  })
}

export default sendEmail
