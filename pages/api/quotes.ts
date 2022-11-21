import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@db";
import { getSession } from "@lib/auth/session";
import { Prisma } from "@prisma/client";


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({
          message: "Unauthorized",
        });
    }

    try {
        const quotes = await prisma.quotation.findMany();

        return res.status(200).json(quotes);

    } catch (error) {

        console.error("[api] quotes", error);
        return res.status(500).json({ statusCode: 500, message: error.message });

    }

}

export default handler