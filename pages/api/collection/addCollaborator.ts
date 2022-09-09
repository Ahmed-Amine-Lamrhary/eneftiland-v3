import { PrismaClient } from "@prisma/client"
import { getSession } from "next-auth/react"
const prisma = new PrismaClient()
import sendEmail from "../../../services/email"

export default async (req: any, res: any) => {
  const session = await getSession({ req })

  if (!session)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  const { collectionId, email } = req.body

  try {
    if (session?.user?.email === email)
      return res.json({
        success: false,
        message: "You can't add yourself",
      })

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user)
      return res.json({
        success: false,
        message: "User doesn't exist",
      })

    const collaborationExists = await prisma.collaborations.findFirst({
      where: {
        userId: user.id,
      },
    })

    if (collaborationExists)
      return res.json({
        success: false,
        message: "Collaborator already exists",
      })

    await prisma.collaborations.create({
      data: {
        collectionId: collectionId,
        userId: user.id,
      },
    })

    const collaborations = await prisma.collaborations.findMany({
      where: {
        collectionId,
      },
      select: {
        userId: true,
        collectionId: true,
        dateCreated: false,
        user: true,
      },
    })

    // notify invited user
    const collection = await prisma.collection.findFirst({
      where: { id: collectionId },
    })

    const subject = `${session.user?.name} has invited you to “${collection?.collectionName}” collection`

    await sendEmail({
      template: "add-collab",
      to: email,
      subject,
      locals: {
        inviterName: session.user?.name,
        collectionName: collection?.collectionName,
        url: `${req.headers.origin}/app/${collectionId}`,
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
      data: collaborations,
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}
