import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@db/index";
import { getSession } from "../../lib/auth/session";

import { hashPassword } from "@lib/auth/passwords";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    const generateQuouteNumber = () => {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = ""
        let charactersLength = characters.length;

        for (var i = 0; i < 5; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result
    }

    if (!session) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    if (req.method === "POST") {
        const { status } = req.body;

        const quoteNumber = generateQuouteNumber();

        const quotation = await prisma.quotation.create({
            data: {
                status: status,
                quoteId: 'Q-' + quoteNumber,
               
            }
        })

        return res.status(200).json(quotation);

    }

}

export default handler