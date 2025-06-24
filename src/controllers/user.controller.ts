import { Request, Response } from 'express';
import { verifyWebhook } from '@clerk/express/webhooks';
import { db } from '../libs/prisma';

export const manageUserWebhooks = async (req: Request, res: Response) => {
  try {
    console.log('WEBHOOK HIT');
    const evt = await verifyWebhook(req);

    if (evt.type === 'user.created') {
      const user = evt.data as any;

      const newUser = await db.user.create({
        data: {
          clerkId: user.id,
          firstName: user.first_name ?? '',
          lastName: user.last_name ?? '',
          email: user.email_addresses[0].email_address,
        },
      });

      console.log('Synced user to DB:', newUser.id);
    }

    res.status(200).json({ status: 'success', message: 'Webhook received' });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    res
      .status(400)
      .json({ status: 'error', message: 'Error verifying webhook' });
  }
};
