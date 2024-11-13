import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth/next"
import authOptions from '../auth/[...nextauth]'
const prisma = new PrismaClient()
import sendEmail from "../../../services/email"

export default async (req: any, res: any) => {
  const session: any = await getServerSession(req, res, authOptions)

  if (!session)
    return res.json({
      success: false,
      message: "Not authorized",
    })

  const { collaborationId } = req.body

  try {
    const collaboration = await prisma.collaborations.findFirst({
      where: { id: collaborationId },
      select: { user: true, collection: true },
    })
    await prisma.collaborations.deleteMany({
      where: {
        id: collaborationId,
      },
    })

    // notify invited user
    const subject = `${session.user?.name} has removed you from “${collaboration?.collection.collectionName}” collection`

    await sendEmail({
      template: "remove-collab",
      to: collaboration?.user.email || "",
      subject,
      locals: {
        inviterName: session.user?.name,
        collectionName: collaboration?.collection.collectionName,
      },
    })

    res.json({
      success: true,
      message: "Operation was done successfully",
    })
  } catch (error: any) {
    res.json({ success: false, message: error.message })
  }
}
