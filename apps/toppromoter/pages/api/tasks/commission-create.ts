import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from '@/utils/supabase-admin';
import { createStripeCommission } from '@/utils/processor-helpers/stripe/stripe-helpers';
import { withSentry } from '@sentry/nextjs';

async function commissionCreateTask(req: NextApiRequest, res: NextApiResponse) {
  try {    
    if (req.method === "POST") {
      const { paymentData, companyId, stripeId, referralId } = req.body as { paymentData: any, companyId: string, stripeId: string, referralId: string };

      if(!paymentData || !companyId || !stripeId || !referralId){
        console.error('Missing fields...')
        return res.status(400).json({ 'message': 'Missing required fields' });
      }

      console.log('companyId: ' + companyId)
      console.log('referralId: ' + referralId)

      const companyFromId = await supabaseAdmin
        .from('companies')
        .select('company_id')
        .eq('company_id', companyId)
        .single();
        
      if(companyFromId?.data === null){
        console.log('COMPANY NOT FOUND!!!')
        return res.status(400).json({ 'message': 'Company not found'});
      }

      await createStripeCommission(paymentData, stripeId, referralId);

      return res.status(400).json({ 'message': 'success'});
  
    } else {
      return res.status(405).json({ 'message': 'Method not allowed'});
    }
  } catch (error) {
    console.log('error:')
    console.log(error)
    return res.status(400).json({ 'message': error});
  }
}

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(commissionCreateTask) : commissionCreateTask;