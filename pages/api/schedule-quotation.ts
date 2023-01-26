import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@db/index";
import { getSession } from "../../lib/auth/session";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    if (req.method === "POST") {
        const { userId, quotationId, status } = req.body;

        const quotation = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                quotations: {
                    connect: {
                        id: quotationId
                    },
                    update: {
                        where: {
                            id: quotationId
                        },
                        data: {
                            status: status
                        }
                        
                    }
                }
            }
        })

        return res.status(200).json(quotation);

    }
}

export default handler