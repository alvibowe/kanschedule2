import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@db";
import { getSession } from "@lib/auth/session";
import { Prisma } from "@prisma/client";

// get user based on email 

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    try{
        const { email } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: email as string,
            },
            include: {
                calendar : {
                    include: { events: true }
                }
            }
        });

        return res.status(200).json(user);
    }
    catch (error) {

        console.error("[api] get user", error);
        return res.status(500).json({ statusCode: 500, message: error.message });

    }
    
}

export default handler