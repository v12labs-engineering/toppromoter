import { withSentry } from '@sentry/nextjs';
import { getUserBypass, supabaseAdmin } from '@/utils/supabase-admin';
import { LogSnagPost } from '@/utils/helpers';
import { sendEmail } from '@/utils/sendEmail';

const manualConversion = async (req, res) => {
  if (req.method === 'POST') {
    const token = req.headers.token;
    const { referralId, invoiceTotal } = req.body;
    
    try {
      const user = await getUserBypass(token);
      if (!user) {
        res
        .status(500)
        .json({ error: { statusCode: 401, message: 'Not authenticated' } });
      }

      let referralUpdate = await supabaseAdmin
      .from('referrals')
      .update({
        referral_converted: true
      })
      .eq('referral_id', referralId);

      if(!referralUpdate?.error){
        let commissionAmount = invoiceTotal > 0 ? referralUpdate?.data?.[0]?.commission_type === "fixed" ? referralUpdate?.data?.[0]?.commission_value : parseFloat((referralUpdate?.data?.[0]?.commission_value/100)*invoiceTotal) : 0;
        let dueDate = new Date();
        if(referralUpdate?.data?.[0]?.minimum_days_payout){
          dueDate.setDate(dueDate.getDate() + referralUpdate?.data?.[0]?.minimum_days_payout);
        } else {
          dueDate.setDate(dueDate.getDate() + 30)
        }

        console.log(commissionAmount)

        let newCommissionValues = await supabaseAdmin.from('commissions').insert({
          id: referralUpdate?.data?.[0]?.id,
          team_id: referralUpdate?.data?.[0]?.team_id,
          company_id: referralUpdate?.data?.[0]?.company_id,
          campaign_id: referralUpdate?.data?.[0]?.campaign_id,
          affiliate_id: referralUpdate?.data?.[0]?.affiliate_id,
          referral_id: referralUpdate?.data?.[0]?.referral_id,
          payment_intent_id: null,
          commission_sale_value: invoiceTotal,
          commission_total: commissionAmount,
          commission_due_date: dueDate.toISOString(),
          commission_description: 'sale created manually',
          custom_field_one: null,
          custom_field_two: null
        }).select();

        if(newCommissionValues?.data && newCommissionValues?.data[0]?.commission_id){
          console.log('Commission was created!')
          const commission = newCommissionValues?.data[0];
          const commissionId = commission?.commission_id;
          await sendEmail(null, null, null, 'new-commission', referralUpdate?.data?.[0]?.company_id, commissionId);
          await sendEmail(null, null, null, 'new-commission-affiliate', referralUpdate?.data?.[0]?.company_id, commissionId);
          await LogSnagPost('commission-created', `New commission registered for campaign ${referralUpdate?.data?.[0]?.campaign_id}`);
          return res.status(200).json({ response: 'success' });
        }
      }
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ error: { statusCode: 500, message: err.message } });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default process.env.SENTRY_AUTH_TOKEN ? withSentry(manualConversion) : manualConversion;