import type { NextApiRequest, NextApiResponse } from "next";
import { encrypt } from '@/utils/crypto';
import { getUserBypass } from '@/utils/supabase-admin';
import { withSentry } from '@sentry/nextjs';

async function cryptoCall(req: NextApiRequest, res: NextApiResponse) {

  try {
    if (req.method === "POST") {
      const token = Array.isArray(req.headers.token)
        ? req.headers.token[0]
        : req.headers.token;
      if (!token) {
        return res.status(401).json({ 'message': 'Unauthorized' });
      }
      await getUserBypass(token);

      const { cryptoType, cryptoArray } = req.body as { cryptoType: string, cryptoArray: any[] };

      if (cryptoArray === null || cryptoArray.length === 0) {
        return res.status(400).json({ 'message': 'Crypto array not found' });
      }

      if (cryptoType !== "encrypt") {
        return res.status(400).json({ 'message': 'Unsupported crypto operation' });
      }

      const encryptedArray = cryptoArray.map((item) => JSON.stringify(encrypt(item)));
      return res.status(200).json({ 'message': 'success', 'data': encryptedArray });

    } else {
      return res.status(405).json({ 'message': 'Method not allowed' });
    }
  } catch (error) {
    return res.status(400).json({ 'message': error });
  }
}

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(cryptoCall) : cryptoCall;
