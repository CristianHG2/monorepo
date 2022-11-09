export interface PNCRequest {
  entity_search_criteria: {
    industry_search_criterias: IndustrySearchCriteria[];
    activity_date_range: ActivityDateRange;
    search_options: SearchOptions;
    sort_criterias: SortCriteria[];
    search_targets: string[];
    min_quality_score: number;
    limit: number;
    search_after: [string, string, string, string];
  };
}

export interface ActivityDateRange {
  min_value: string;
}

export interface IndustrySearchCriteria {
  code: string;
  code_type: string;
  primary: boolean;
}

export interface SearchOptions {
  match_all_terms: boolean;
  exclude_fields: string[];
}

export interface SortCriteria {
  employee_count: string;
}

export interface PNCResponse {
  page_id: [string, string, string, string];
  results: Result[];
}

export interface Result {
  accounting_firms: any[];
  activity_date: string;
  address_one: string;
  address_two: string;
  city: string;
  contacts: any[];
  county: string;
  ein: string;
  employee_count: number;
  entity_name: string;
  fidelity_bonds: any[];
  has_self_funded_plans: boolean;
  self_funded_plans_ind: number;
  is_out_of_business: boolean;
  latitude: number;
  lead_accounting_firm: null;
  lead_actuary: null;
  lead_broker_influencer: null;
  lead_peo: null;
  lead_pnc_broker: {
    name_normalized: string;
  } | null;
  lead_tpa: null;
  longitude: number;
  muns: string;
  most_recent_lead_broker_influencer: null;
  phone_number: string;
  quality_score: number;
  revenue_range: RevenueRange | null;
  searched_by_broker_influencer: null;
  signatures: null;
  signature_sources: any[];
  social_media_links: SocialMediaLinks;
  sources: Source[];
  state: string;
  website: string;
  zip_code: string;
  compliance_report: ComplianceReport;
  dot_summary: DotSummary | null;
  ex_mod_results: null;
  has_assigned_risk: null;
  industry_codes: any[];
  latest_osha_inspection_data: null;
  latest_whd_action_data: null;
  lob_summaries_by_policy_type: {
    WORKERS_COMPENSATION: {
      policy_number: string;
      normalized_insurance_carrier_name: string;
      effective_date: string;
      fixed_renewal_date: string;
    };
  } | null;
  primary_mic: string;
  primary_mic_description: string;
  secondary_mic: string;
  secondary_mic_description: string;
  naics: string;
  naics_description: string;
  total_estimated_state_standard_wc_premium: null;
  lead_peo_details: null;
}

export interface ComplianceReport {
  checks: Check[];
}

export interface Check {
  compliance_type: string;
  result: string;
}

export interface DotSummary {
  carrier_operation: string;
  details: any[];
  dot_numbers: number[];
  driver_total: number;
  latest_compliance_date: string;
  mcs150_mileage: number;
  mcs150_mileage_year: number;
  nbr_power_unit: number;
  total_annual_mileage: number;
}

export interface RevenueRange {
  max_value: number;
  min_value: number;
}

export interface SocialMediaLinks {
  facebook_url: string;
  linkedin_url: string;
  twitter_url: string;
}

export interface Source {
  name: string;
  filed_date: null;
}
