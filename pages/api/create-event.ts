import { NextApiRequest, NextApiResponse } from "next";

import prisma from "@db/index";
import { getSession } from "../../lib/auth/session";
import { ca } from "date-fns/locale";
import { callbackify } from "util";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays/index.js";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    if (req.method === "POST") {
        const { calendarId, title, start, end, allDay } = req.body;

        const event = await prisma.event.create({
            data: {
                title: title,     
                start: start,
                end: end,
                allDay: allDay,     
                calendar: {
                    connect: {
                       id: calendarId 
                    }
                }
                
                //calendar  
               
            }
        })

        return res.status(200).json(event);

    }
}

export default handler