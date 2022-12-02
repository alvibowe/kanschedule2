import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../db";
import { getSession } from "../../lib/auth/session";

import { hashPassword } from "@lib/auth/passwords";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    
    // if (!session) {
    //     return res.status(401).json({
    //       message: "Unauthorized",
    //     });
    // }

    try {
        console.log(session.user.role);
        if (session.user.role === 'scheduling administrator' || session.user.role === 'system manager') {
           
            

            const quote = await prisma.quotation.delete({
                where: { quoteId: req.body.id },
            })

            return res.status(200).json(quote);
            
        }else{
            return res.status(401).json({
                message: "Unauthorized user credentials",
              });
        }
    }
    catch(error){
        return res.status(500).json({ statusCode: 500, message: error.message });
    }

}

export default handler