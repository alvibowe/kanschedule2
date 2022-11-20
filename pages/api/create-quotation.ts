import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@db/index";
import { getSession } from "../../lib/auth/session";

import { hashPassword } from "@lib/auth/passwords";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    
    if (!session) {
        return res.status(401).json({
          message: "Unauthorized",
        });
    }

    if (req.method === "POST") {
        const { status } = req.body;

        const quotation = await prisma.quotation.create({
            data: {
                status: status,
            }
        })

        return res.status(200).json(quotation);

    }

}

export default handler