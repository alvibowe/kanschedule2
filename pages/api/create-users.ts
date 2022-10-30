import { NextApiRequest, NextApiResponse } from "next";
import isEmpty from "lodash/isEmpty";
import nc from "next-connect";
import prisma from "../../db";
import { getSession } from "../../lib/auth/session";
import { Prisma } from "@prisma/client";
import { verifyPassword, hashPassword } from "@lib/auth/passwords";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    
    if (!session) {
        return res.status(401).json({
          message: "Unauthorized",
        });
    }

    if (req.method === "POST") {
        console.log("req.body", req.body);
        const { name, email, role, company, password } = req.body;

        const user = await prisma.user.create({
            data: {
                name: name,
                email: email,
                role: role,
                company: company,
                password: password,
            }
        })

        return res.status(200).json(user);

    }

}

export default handler