import { supabaseAdmin } from '@/utils/supabase-admin';
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: 'nodejs',
};

//Get public campaigns
const getPublicCampaign = async (handle: any, campaignId: any) => {
  let campaignDetails = {} as any;

  if(handle){
    let { data } = await supabaseAdmin
    .from('companies')
    .select('company_id, company_image, company_name, company_currency')
    .eq('company_handle', handle)
    .single()

    if(data){
      campaignDetails.company_id = data?.company_id;
      campaignDetails.company_image = data?.company_image;
      campaignDetails.company_name = data?.company_name;
      campaignDetails.company_currency = data?.company_currency;
    }
  }

  if(campaignId === null && campaignDetails?.company_id){
    let { data } = await supabaseAdmin
      .from('campaigns')
      .select('campaign_id, campaign_name, commission_type, commission_value, campaign_public, custom_campaign_data')
      .eq('company_id', campaignDetails?.company_id)
      .eq('default_campaign', true)
      .single()

    if(data){
      campaignDetails.campaign_id = data?.campaign_id;
      campaignDetails.campaign_name = data?.campaign_name;
      campaignDetails.commission_type = data?.commission_type;
      campaignDetails.commission_value = data?.commission_value;
      campaignDetails.campaign_public = data?.campaign_public;
      campaignDetails.custom_campaign_data = data?.custom_campaign_data;
    }
  } else {
    let { data } = await supabaseAdmin
      .from('campaigns')
      .select('campaign_id, campaign_name, commission_type, commission_value, campaign_public, custom_campaign_data')
      .eq('campaign_id', campaignId)
      .single()

    if(data){
      campaignDetails.campaign_id = data?.campaign_id;
      campaignDetails.campaign_name = data?.campaign_name;
      campaignDetails.commission_type = data?.commission_type;
      campaignDetails.commission_value = data?.commission_value;
      campaignDetails.campaign_public = data?.campaign_public;
      campaignDetails.custom_campaign_data = data?.custom_campaign_data;
    }
  }

  return campaignDetails;
};

interface Data {
  campaign?: any;
  error?: any;
}

export default async function campaignHandler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method === 'POST') {
    const { companyHandle, campaignId } = req.body;

    try {
        const campaign = await getPublicCampaign(companyHandle, campaignId);

        return res.status(200).json({ campaign });

    } catch (err: any) {
      console.log(err);
      return res.status(500).json({ campaign: null });
    }
  } else {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
}
