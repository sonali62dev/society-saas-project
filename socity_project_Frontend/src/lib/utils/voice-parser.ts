export interface ParsedVisitor {
  name: string
  phone: string
  unit: string
  purpose: string
}

export function parseVoiceCommand(text: string): ParsedVisitor {
  const normalized = text.toLowerCase()
  let name = ''
  let phone = ''
  let unit = ''
  let purpose = ''

  // 1. Extract Phone Number (Look for 10 consecutive digits, or digits separated by space)
  const allDigits = normalized.replace(/\D/g, '')
  if (allDigits.length >= 10) {
    // Take last 10 digits commonly
    phone = allDigits.slice(-10)
  }

  // 2. Identify Purpose (look for keywords)
  const purposeKeywords: { [key: string]: string } = {
    'delivery': 'Delivery',
    'swiggy': 'Food Delivery',
    'zomato': 'Food Delivery',
    'amazon': 'Delivery',
    'flipkart': 'Delivery',
    'cab': 'Cab/Taxi',
    'taxi': 'Cab/Taxi',
    'uber': 'Cab/Taxi',
    'ola': 'Cab/Taxi',
    'maintenance': 'Maintenance',
    'plumber': 'Plumber',
    'electrician': 'Electrician',
    'guest': 'Guest Visit',
    'family': 'Guest Visit',
    'relative': 'Guest Visit',
    'maid': 'Maid/Cook',
    'food': 'Food Delivery'
  }

  for (const [key, val] of Object.entries(purposeKeywords)) {
    if (normalized.includes(key)) {
      purpose = val
      break
    }
  }
  if (!purpose) purpose = 'Guest Visit' // fallback default

  // 3. Identify Unit Number
  // Match pattern like "flat 101", "unit 102", "block a 202" etc
  const unitRegex = /(?:flat|unit|block|ghar|number)\s*([a-z]?\s*\d+)/i
  const unitMatch = normalized.match(unitRegex)
  if (unitMatch && unitMatch[1]) {
    unit = unitMatch[1].replace(/\s+/g, '').toUpperCase()
  } else {
    // fallback: look for any 3-4 digit number that is not part of the phone number
    const otherNumbers = text.match(/\b\d{3,4}\b/)
    if (otherNumbers && otherNumbers[0] !== phone) {
      unit = otherNumbers[0]
    }
  }

  // 4. Extract Name 
  // Usually the first few words before any identifiers like 'from', 'flat', 'number', 'phone'
  const stopWords = ['from', 'flat', 'unit', 'number', 'phone', 'for', 'delivery', 'se', 'ka', 'ko']
  const tokens = text.split(/\s+/)
  const nameTokens = []
  for (let token of tokens) {
    if (stopWords.includes(token.toLowerCase()) || /^\d+$/.test(token)) {
      break
    }
    nameTokens.push(token)
  }
  
  if (nameTokens.length > 0) {
    name = nameTokens.join(' ')
  }

  return {
    name: name.trim(),
    phone: phone.trim(),
    unit: unit.trim(),
    purpose
  }
}
