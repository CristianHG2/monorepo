import {PNCRequest, PNCResponse, Result} from '../support/types';

export const getPncResponse = async (request: PNCRequest) => {
  console.log(`[ZyCSV] Fetching PNC, payload: ${JSON.stringify(request)}...`);

  const response = await (
    await fetch('https://miedge.net/api/search/pnc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        _zycsv: true,
      }),
    })
  ).json();

  if (!response) {
    throw new Error('Zywave did not return a proper response');
  }

  console.log(`[ZyCSV] Response to PNC request received!`);
  return response as PNCResponse;
};

export const fetchUntilComplete = async (
  _request: PNCRequest,
  buffer: Result[] = [],
): Promise<Result[]> => {
  const request = {..._request};

  const response = await getPncResponse(request);
  const results = [...buffer, ...response.results];

  console.log(`[ZyCSV] Current result set length: ${results.length}`);

  if (response.results && response.results.length > 0) {
    return fetchUntilComplete(
      {
        entity_search_criteria: {
          ...request.entity_search_criteria,
          search_after: response.page_id,
        },
      },
      results,
    );
  }

  return results;
};

export const wc = (result: Result) => {
  if (
    result.lob_summaries_by_policy_type &&
    result.lob_summaries_by_policy_type.WORKERS_COMPENSATION
  ) {
    const comp = result.lob_summaries_by_policy_type.WORKERS_COMPENSATION;

    return {
      carrier: comp.normalized_insurance_carrier_name,
      renewalDate: comp.fixed_renewal_date,
      effectiveDate: comp.effective_date,
      policyNumber: comp.policy_number,
    };
  }

  return {
    carrier: '',
    renewalDate: '',
    effectiveDate: '',
    policyNumber: '',
  };
};

type Primitive = string | number | boolean | null | undefined;

export const mutateResults = (results: Result[]) => {
  console.log(`[ZyCSV] Mutating ${results.length} results...`);

  return results.map<Record<string, Primitive>>(result => {
    const _wc = wc(result);

    return {
      name: result.entity_name,
      broker: result.lead_pnc_broker?.name_normalized,
      ein: result.ein,
      phone: result.phone_number,
      primaryIndustry: result.primary_mic_description,
      secondaryIndustry: result.secondary_mic_description,
      facebook: result.social_media_links.facebook_url,
      twitter: result.social_media_links.twitter_url,
      linkedin: result.social_media_links.linkedin_url,
      state: result.state,
      employees: result.employee_count,
      revenue: `${result.revenue_range?.min_value} - ${result.revenue_range?.max_value}`,
      fidelityBond: result.fidelity_bonds.length,
      workersCompCarrier: _wc.carrier,
      workersCompRenewalDate: _wc.renewalDate,
      workersCompEffectiveDate: _wc.effectiveDate,
      workersCompPolicyNumber: _wc.policyNumber,
      annualPremium: result.total_estimated_state_standard_wc_premium,
      peo: result.lead_peo,
      dotClassification: result.dot_summary?.carrier_operation,
      latestOshaInspection: result.latest_osha_inspection_data,
      address: `${result.address_one} ${result.address_two}`,
      city: result.city,
      county: result.county,
      zip: result.zip_code,
      naics: result.naics,
      naicsDescription: result.naics_description,
      website: result.website,
    };
  });
};
