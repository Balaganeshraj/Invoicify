export interface ServiceCategory {
  id: string;
  name: string;
  subcategories: ServiceSubcategory[];
}

export interface ServiceSubcategory {
  id: string;
  name: string;
  description?: string;
  suggestedRate?: number;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'digital-advertising',
    name: 'Digital Advertising Agency',
    subcategories: [
      { id: 'google-ads', name: 'Google Ads Management', description: 'PPC campaign management and optimization', suggestedRate: 150 },
      { id: 'facebook-ads', name: 'Facebook Ads Management', description: 'Social media advertising campaigns', suggestedRate: 120 },
      { id: 'display-advertising', name: 'Display Advertising', description: 'Banner and visual ad campaigns', suggestedRate: 100 },
      { id: 'video-advertising', name: 'Video Advertising', description: 'YouTube and video platform ads', suggestedRate: 180 },
      { id: 'retargeting', name: 'Retargeting Campaigns', description: 'Audience retargeting and remarketing', suggestedRate: 130 }
    ]
  },
  {
    id: 'advertising-agency',
    name: 'Advertising Agency',
    subcategories: [
      { id: 'brand-strategy', name: 'Brand Strategy', description: 'Brand positioning and strategy development', suggestedRate: 200 },
      { id: 'creative-campaigns', name: 'Creative Campaigns', description: 'Campaign concept and creative development', suggestedRate: 250 },
      { id: 'media-planning', name: 'Media Planning', description: 'Media strategy and planning services', suggestedRate: 180 },
      { id: 'market-research', name: 'Market Research', description: 'Consumer and market analysis', suggestedRate: 160 },
      { id: 'brand-identity', name: 'Brand Identity Design', description: 'Logo and brand visual identity', suggestedRate: 300 }
    ]
  },
  {
    id: 'marketing-services',
    name: 'Marketing Services',
    subcategories: [
      { id: 'content-marketing', name: 'Content Marketing', description: 'Content strategy and creation', suggestedRate: 100 },
      { id: 'marketing-strategy', name: 'Marketing Strategy', description: 'Comprehensive marketing planning', suggestedRate: 180 },
      { id: 'lead-generation', name: 'Lead Generation', description: 'Lead acquisition and nurturing', suggestedRate: 140 },
      { id: 'conversion-optimization', name: 'Conversion Optimization', description: 'CRO and funnel optimization', suggestedRate: 160 },
      { id: 'marketing-automation', name: 'Marketing Automation', description: 'Automated marketing workflows', suggestedRate: 120 }
    ]
  },
  {
    id: 'printing-services',
    name: 'Printing Services',
    subcategories: [
      { id: 'business-cards', name: 'Business Cards', description: 'Professional business card printing', suggestedRate: 50 },
      { id: 'brochures', name: 'Brochures', description: 'Marketing brochure design and printing', suggestedRate: 80 },
      { id: 'flyers', name: 'Flyers', description: 'Promotional flyer printing', suggestedRate: 40 },
      { id: 'banners', name: 'Banners', description: 'Large format banner printing', suggestedRate: 120 },
      { id: 'packaging', name: 'Packaging Design', description: 'Product packaging design and printing', suggestedRate: 200 }
    ]
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing Services',
    subcategories: [
      { id: 'google-ads-mgmt', name: 'Google Ads', description: 'Google Ads campaign management', suggestedRate: 150 },
      { id: 'social-media-mgmt', name: 'Social Media Management', description: 'Social media strategy and management', suggestedRate: 100 },
      { id: 'email-marketing', name: 'Email Marketing', description: 'Email campaign design and management', suggestedRate: 80 },
      { id: 'influencer-marketing', name: 'Influencer Marketing', description: 'Influencer campaign coordination', suggestedRate: 120 },
      { id: 'affiliate-marketing', name: 'Affiliate Marketing', description: 'Affiliate program management', suggestedRate: 110 }
    ]
  },
  {
    id: 'seo-services',
    name: 'SEO Services',
    subcategories: [
      { id: 'seo-audit', name: 'SEO Audit', description: 'Comprehensive website SEO analysis', suggestedRate: 200 },
      { id: 'keyword-research', name: 'Keyword Research', description: 'SEO keyword analysis and strategy', suggestedRate: 120 },
      { id: 'on-page-seo', name: 'On-Page SEO', description: 'Website optimization and content SEO', suggestedRate: 100 },
      { id: 'link-building', name: 'Link Building', description: 'Authority link acquisition', suggestedRate: 150 },
      { id: 'local-seo', name: 'Local SEO', description: 'Local business SEO optimization', suggestedRate: 130 }
    ]
  },
  {
    id: 'website-services',
    name: 'Website Services',
    subcategories: [
      { id: 'website-redesign', name: 'Website Redesign', description: 'Complete website redesign and modernization', suggestedRate: 500 },
      { id: 'ecommerce-dev', name: 'E-commerce Development', description: 'Online store development and setup', suggestedRate: 800 },
      { id: 'landing-page', name: 'Landing Page Design', description: 'High-converting landing page creation', suggestedRate: 300 },
      { id: 'website-maintenance', name: 'Website Maintenance', description: 'Ongoing website updates and maintenance', suggestedRate: 80 },
      { id: 'website-hosting', name: 'Website Hosting', description: 'Web hosting and domain management', suggestedRate: 50 }
    ]
  },
  {
    id: 'web-development',
    name: 'Web Development Services',
    subcategories: [
      { id: 'frontend-dev', name: 'Frontend Development', description: 'User interface development', suggestedRate: 120 },
      { id: 'backend-dev', name: 'Backend Development', description: 'Server-side application development', suggestedRate: 140 },
      { id: 'fullstack-dev', name: 'Full-Stack Development', description: 'Complete web application development', suggestedRate: 160 },
      { id: 'api-development', name: 'API Development', description: 'REST API and integration services', suggestedRate: 130 },
      { id: 'cms-development', name: 'CMS Development', description: 'Content management system development', suggestedRate: 150 }
    ]
  }
];

export const getServiceCategory = (categoryId: string): ServiceCategory | undefined => {
  return serviceCategories.find(category => category.id === categoryId);
};

export const getServiceSubcategory = (categoryId: string, subcategoryId: string): ServiceSubcategory | undefined => {
  const category = getServiceCategory(categoryId);
  return category?.subcategories.find(sub => sub.id === subcategoryId);
};

export const searchServices = (query: string): Array<{ category: ServiceCategory; subcategory: ServiceSubcategory }> => {
  const results: Array<{ category: ServiceCategory; subcategory: ServiceSubcategory }> = [];
  const lowerQuery = query.toLowerCase();

  serviceCategories.forEach(category => {
    category.subcategories.forEach(subcategory => {
      if (
        subcategory.name.toLowerCase().includes(lowerQuery) ||
        subcategory.description?.toLowerCase().includes(lowerQuery) ||
        category.name.toLowerCase().includes(lowerQuery)
      ) {
        results.push({ category, subcategory });
      }
    });
  });

  return results;
};