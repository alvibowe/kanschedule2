import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../db";
import { getSession } from "../../lib/auth/session";

import { hashPassword } from "@lib/auth/passwords";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    
    if (!session) {
        return res.status(401).json({
          message: "Unauthorized",
        });
    }

    try {
        if (session.user.email === req.body.email){
            return res.status(401).json({
                message: "Unauthorized",
              });
        }else{
            // const user = await prisma.user.delete({
            //     where: { email: req.body.email },
            // })

            // return res.status(200).json(user);
        }
    }
    catch(error){
        return res.status(500).json({ statusCode: 500, message: error.message });
    }

}

export default handler