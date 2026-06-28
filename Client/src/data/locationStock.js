/**
 * Location & Stock Data for Bilal Kebabs & Biryani
 *
 * Each location shares the same menu (menuItems.js) but carries
 * independent stock quantities.  In production this would come
 * from a database / API — for now we use realistic dummy numbers.
 */

export const locations = [
  {
    id: 'anna-salai',
    name: 'Anna Salai',
    shortLabel: 'Anna Salai',
    address: 'Mount Road, Anna Salai, Chennai - 600002',
    icon: '📍',
  },
  {
    id: 'ecr',
    name: 'East Coast Road',
    shortLabel: 'ECR',
    address: 'ECR Main Road, Neelankarai, Chennai - 600041',
    icon: '🏖️',
  },
  {
    id: 'perungudi',
    name: 'Perungudi',
    shortLabel: 'Perungudi',
    address: 'OMR, Perungudi Junction, Chennai - 600096',
    icon: '🏢',
  },
  {
    id: 'sholinganallur',
    name: 'Sholinganallur',
    shortLabel: 'S.Nallur',
    address: 'OMR, Sholinganallur Signal, Chennai - 600119',
    icon: '🌆',
  },
];

/**
 * Per-location stock map.
 * Structure:  { locationId: { itemId: stockCount } }
 *
 * Stock numbers are intentionally varied to showcase:
 *  - High stock (Anna Salai flagship)
 *  - Medium stock (ECR / Perungudi)
 *  - Low / zero stock (Sholinganallur — smaller outlet)
 */
export const locationStock = {
  'anna-salai': {
    // Biryani
    'bir-001': 120,
    'bir-002': 85,
    'bir-003': 60,
    'bir-004': 45,
    // Kebabs
    'keb-001': 90,
    'keb-002': 75,
    'keb-003': 50,
    'keb-004': 40,
    'keb-005': 55,
    // Starters
    'str-001': 100,
    'str-002': 35,
    'str-003': 30,
    // Breads
    'brd-001': 200,
    'brd-002': 150,
    'brd-003': 80,
    // Beverages
    'bev-001': 300,
    'bev-002': 60,
    'bev-003': 90,
    // Desserts
    'des-001': 40,
    'des-002': 70,
  },

  ecr: {
    // Biryani
    'bir-001': 60,
    'bir-002': 40,
    'bir-003': 25,
    'bir-004': 8,
    // Kebabs
    'keb-001': 35,
    'keb-002': 20,
    'keb-003': 15,
    'keb-004': 12,
    'keb-005': 7,
    // Starters
    'str-001': 30,
    'str-002': 5,
    'str-003': 18,
    // Breads
    'brd-001': 80,
    'brd-002': 50,
    'brd-003': 25,
    // Beverages
    'bev-001': 120,
    'bev-002': 9,
    'bev-003': 45,
    // Desserts
    'des-001': 3,
    'des-002': 22,
  },

  perungudi: {
    // Biryani
    'bir-001': 100,
    'bir-002': 70,
    'bir-003': 6,
    'bir-004': 30,
    // Kebabs
    'keb-001': 50,
    'keb-002': 9,
    'keb-003': 25,
    'keb-004': 0,
    'keb-005': 18,
    // Starters
    'str-001': 55,
    'str-002': 2,
    'str-003': 0,
    // Breads
    'brd-001': 120,
    'brd-002': 80,
    'brd-003': 4,
    // Beverages
    'bev-001': 200,
    'bev-002': 0,
    'bev-003': 60,
    // Desserts
    'des-001': 8,
    'des-002': 35,
  },

  sholinganallur: {
    // Biryani
    'bir-001': 1,
    'bir-002': 5,
    'bir-003': 0,
    'bir-004': 3,
    // Kebabs
    'keb-001': 7,
    'keb-002': 0,
    'keb-003': 2,
    'keb-004': 0,
    'keb-005': 4,
    // Starters
    'str-001': 9,
    'str-002': 0,
    'str-003': 6,
    // Breads
    'brd-001': 15,
    'brd-002': 8,
    'brd-003': 0,
    // Beverages
    'bev-001': 50,
    'bev-002': 3,
    'bev-003': 1,
    // Desserts
    'des-001': 0,
    'des-002': 5,
  },
};
