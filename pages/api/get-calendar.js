import { NextApiRequest, NextApiResponse } from "next";
import isEmpty from "lodash/isEmpty";
import nc from "next-connect";
import prisma from "@db";
import { getSession } from "@lib/auth/session";
import { Prisma } from "@prisma/client";

// get individual calendar data

const handler = async (req, res) => {

    const session = await getSession({ req });
    
    if (!session) {
        return res.status(401).json({
        message: "Unauthorized",
        });
    }
    
    
    try {
        const calendar = await prisma.user.findMany({
            include: {
                calendar : {
                    include: { events: true }
                }
            }
        });
        
        return res.status(200).json(calendar);
    } catch (error) {
        console.error("[api] calendar", error);
        return res.status(500).json({ statusCode: 500, message: error.message });
    }
}

export default handler;