import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../db";
import { getSession } from "../../lib/auth/session";
import { Prisma } from "@prisma/client";
import { hashPassword } from "@lib/auth/passwords";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    
    if (!session) {
        return res.status(401).json({
          message: "Unauthorized",
        });
    }

    if (req.method === "POST") {
        const { name, email, role, company, password } = req.body;

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                role: role,
                company: company,
                password: await hashPassword(password),
            }
        })

        return res.status(200).json(user);

    }

}

export default handler