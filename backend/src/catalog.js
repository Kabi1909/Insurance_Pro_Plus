// Informational product content is not customer/admin mock data.
export const products = [
  ['health', 'Individual', 'Health Insurance', 'Comprehensive medical coverage for you and your family.', ['Doctor visits', 'Hospital stays', 'Prescription drugs'], 0.0015],
  ['life', 'Individual', 'Life Insurance', "Protect your family's financial future with term or whole life coverage.", ['Tax-free benefit', 'Flexible terms', 'Rider options'], 0.0005],
  ['motor', 'Individual', 'Motor Insurance', 'Coverage for accidents, theft, and third-party liabilities.', ['24/7 Roadside', 'Zero depreciation', 'Quick claim'], 0.002],
  ['home', 'Individual', 'Home Insurance', 'Protect your house and belongings against fire, theft, and natural disasters.', ['Property protection', 'Valuables cover', 'Liability protection'], 0.0008],
  ['bp', 'Business', 'Business Property Insurance', 'Protect your physical assets, equipment, and inventory.', ['Building cover', 'Equipment breakdown', 'Business interruption'], 0.001],
  ['bv', 'Business', 'Commercial Vehicle', 'Coverage for your business fleet and company cars.', ['Fleet discounts', 'Liability cover', 'Employee drivers'], 0.002],
  ['ep', 'Business', 'Employee Insurance', 'Group health and protection plans for your workforce.', ['Group health', 'Workers comp', 'Dental/Vision'], 0.0015],
  ['cyber', 'Business', 'Cyber Insurance', 'Protection against data breaches and cyber attacks.', ['Data recovery', 'Legal costs', 'Ransomware cover'], 0.0012],
  ['liability', 'Business', 'Liability Insurance', 'Protect your business against legal claims and lawsuits.', ['General liability', 'Professional indemnity', 'Legal fees'], 0.001],
].map(([id, type, name, desc, benefits, rate]) => ({ id, type, name, desc, benefits, rate,
  exclusions: ['Intentional damage or fraudulent claims', 'Events outside the agreed policy period', 'Items not included in your selected cover'],
  eligibility: 'Subject to verification of your application and the terms of the selected policy.',
}));
export const defaultSettings = {
  companyName: 'Insurance Pro Plus', email: 'support@insuranceproplus.com', phone: '', address: '',
  currency: 'USD', rates: Object.fromEntries(products.map(p => [p.id, p.rate])), minPremium: 10,
};
