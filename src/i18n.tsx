/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi';

export const translations = {
  en: {
    // Brand & Commons
    brand: 'KapadaSETU',
    tagline: 'Bridging Cloth Waste with Green Recyclers',
    home: 'Home',
    dashboard: 'Dashboard',
    listings: 'Browse Waste',
    deals: 'My Deals',
    messages: 'Chat Box',
    admin: 'Admin Center',
    logout: 'Logout',
    language: 'English',
    toggleLang: 'हिंदी',
    kg: 'kg',
    rupee: '₹',
    save: 'Save Changes',
    cancel: 'Cancel',
    status: 'Status',
    actions: 'Actions',
    loading: 'Loading...',

    // Landing Page
    heroTitle: 'Turn Textile Waste Into Eco-Wealth',
    heroSubtitle: 'Connecting local boutiques, tailors, and factories with high-impact recyclers. Let’s stop India’s cloth mountains together.',
    joinAsSeller: 'Start Selling Waste',
    joinAsBuyer: 'Find Raw Materials',
    impactTitle: 'Our Environmental Impact',
    statWaste: 'Cloth Sorted & Saved',
    statDeals: 'Transaction Value',
    statCO2: 'CO2 Emissions Prevented',
    howItWorks: 'How KapadaSETU Works',
    step1Title: '1. Collect & Post',
    step1Desc: 'Sellers snap a photo and list tailoring cuts, denim scraps, or old cloth stacks in kilograms.',
    step2Title: '2. Discover & Match',
    step2Desc: 'Recyclers find listing piles sorted by cloth type (Cotton, Synthetic, Mixed) within an interactive map distance.',
    step3Title: '3. Deal & Secure Pay',
    step3Desc: 'Bargain in-app. Once agreed, the buyer deposits funds into secure platform escrow via integrated Razorpay.',
    step4Title: '4. Local Transport & Payout',
    step4Desc: 'Book a tempo or truck. Once delivered, both parties verify the batch, and funds are instantly released to the seller.',

    // Onboarding
    onboardTitle: 'Complete Your Profile',
    onboardSubtitle: 'Become a part of India’s largest fabric recycling network',
    selectRole: 'Select Your Primary Role',
    sellerRoleName: 'Cloth Waste Seller',
    sellerRoleDesc: 'Tailor, Boutique, Fabric Mill, or Society collecting excess cuttings and old garments.',
    buyerRoleName: 'Eco-Recycler / Buyer',
    buyerRoleDesc: 'Mill owner or craftsperson converting rags into yarn, blankets, paper, or industrial fillers.',
    fullName: 'Full Name (Contact Person)',
    businessName: 'Business / Shop Name',
    phone: 'Phone Number (+91)',
    pincode: 'Pincode (6 digits)',
    pincodeHelper: 'Pincode coordinates are used for geo-map matching.',
    addressLine: 'Full Address',
    gstin: 'GSTIN (Optional)',
    registerBtn: 'Activate Profile',

    // Seller Dashboard
    postWasteTitle: 'List a New Cloth Waste Batch',
    clothType: 'Fabric Material Type',
    pureCotton: '100% Pure Cotton',
    mixedCloth: 'Mixed Fabrics / Denim',
    synthetic: 'Synthetic / Polyester Mesh',
    otherCloth: 'Other / Industrial Rags',
    qtyKg: 'Quantity (in kilograms)',
    expectedPrice: 'Expected Price per kg (₹)',
    openToOffers: 'Open to Bargaining / Offers',
    conditionNotes: 'Material Condition & Sorted Notes',
    conditionPlaceholder: 'e.g. Dry, clean sewing clips, white and blue pieces separated...',
    postBtn: 'Post Waste Listing',
    myListings: 'My Live Waste Listings',
    noListings: 'No waste posted yet. Start by creating a listing above!',
    offersReceived: 'Offers Received on Listings',
    earnings: 'My Wallet / Earnings',
    escrowHeld: 'Secured Escrow Value',
    totalWithdrawn: 'Disbursed Payouts',

    // Buyer Dashboard & Listings
    findWaste: 'Discover Scrap Material Piles',
    filterType: 'Filter Fabric Type',
    filterDistance: 'Max Radius Distance (km)',
    allTypes: 'All Fabrics',
    browseList: 'Active Waste near you',
    distanceKm: 'km away',
    expectedLabel: 'Expects:',
    openOfferLabel: 'Open to Offers',
    viewDetails: 'Negotiate & Message',
    makeOfferTitle: 'Propose a Purchase Offer',
    offerPrice: 'Offered Price per kg (₹)',
    offerQty: 'Proposed Quantity (kg)',
    offerMsg: 'Bargain message to Seller',
    submitOffer: 'Send Buy Offer',
    backToListings: '← Back to Listings',

    // Deal Detail & Timeline
    dealStatusLabel: 'Deal Escrow Phase:',
    awaitingPayment: 'Awaiting Escrow Payment',
    paidEscrow: 'Funds Held in Escrow',
    inTransit: 'Shipment Dispatched',
    deliveredStatus: 'Delivered (Awaiting Seller Release)',
    completedStatus: 'Deal Completed & Disbursed',
    cancelledStatus: 'Transaction Refunded/Cancelled',
    disputedStatus: 'Under Dispute / Audit',
    payWithRazorpay: 'Pay ₹{amount} Securely',
    deliveryAddress: 'Delivery Address:',
    pickupAddress: 'Pickup Address:',

    // Transport Bookings
    transportBookingTitle: 'Logistics & Pickup Setup',
    arrangeTransportBtn: 'Book Local Delivery Tempo',
    vehicleType: 'Select Delivery Vehicle Type',
    threeWheeler: '3-Wheeler Loader (Tata Zip) - ₹400 base',
    chotaHathi: 'Mini Truck (Tata Ace) - ₹800 base',
    pickupTruck: 'Pickup Truck (Bolero) - ₹1500 base',
    pickupSlot: 'Preferred Pickup Date & Hour Slot',
    pickupSlotPlaceholder: 'e.g., Saturday 10:00 AM',
    estCost: 'Estimated Transit Cost:',
    providerLabel: 'Transport Service Provider',
    selfArranged: 'Self-Arranged (We use our own vehicle)',
    thirdPartyArranged: 'KapadaSETU Express Logistics',
    bookTransportConfirm: 'Confirm & Schedule Cargo Pickup',
    transitDetails: 'Transit Tracking Notes',
    markDispatched: 'Mark Dispatched & In Transit',
    markDelivered: 'Confirm Shipment Delivery',

    // Trust / Reviews
    ratingTitle: 'Rate the Transaction',
    submitReview: 'Submit Two-Way Review',
    commentLabel: 'Review Comment',
    reviewerRoleLabel: 'Reviewed as:',
    raiseDisputeBtn: 'File a Platform Dispute',
    disputeReason: 'Reason for Dispute (Defect, Wet Fabric, Quantity mismatch, etc.)',
    disputePending: 'A dispute has been raised. Platform Admin is reviewing the transaction details.',

    // Admin Center
    adminTitle: 'KapadaSETU Operator Dashboard',
    totalPlatformDeals: 'Total Commission Collected',
    disputesTitle: 'Unresolved Escrow Disputes',
    disputeTableDeal: 'Deal ID',
    disputeTableRaisedBy: 'Raised By',
    disputeTableReason: 'Reason',
    resolveRefundBtn: 'Resolve & Refund Buyer',
    resolveReleaseBtn: 'Resolve & Release to Seller',
    userManagement: 'Verified Users & KYC Registry',
    kycStatusLabel: 'KYC Status',
    verifyKyc: 'Verify KYC',
  },
  hi: {
    // Brand & Commons
    brand: 'कपड़ाSETU',
    tagline: 'कपड़ा कचरे और पर्यावरण रीसाइक्लर्स का संगम',
    home: 'मुख्य पृष्ठ',
    dashboard: 'डैशबोर्ड',
    listings: 'कचरा खोजें',
    deals: 'मेरे सौदे',
    messages: 'बातचीत',
    admin: 'एडमिन पैनल',
    logout: 'लॉगआउट',
    language: 'हिंदी',
    toggleLang: 'English',
    kg: 'किलोग्राम',
    rupee: '₹',
    save: 'बदलाव सहेजें',
    cancel: 'रद्द करें',
    status: 'स्थिति',
    actions: 'कार्रवाई',
    loading: 'लोड हो रहा है...',

    // Landing Page
    heroTitle: 'कपड़ा कचरे को बनाएं पर्यावरण की दौलत',
    heroSubtitle: 'स्थानीय दर्जी, बुटीक और फैक्ट्रियों को रीसाइक्लर्स से जोड़ना। आइए मिलकर भारत के कपड़े के पहाड़ों को रोकें।',
    joinAsSeller: 'कचरा बेचना शुरू करें',
    joinAsBuyer: 'कच्चा माल खोजें',
    impactTitle: 'हमारा पर्यावरणीय प्रभाव',
    statWaste: 'सहेजा गया कपड़ा कचरा',
    statDeals: 'लेनदेन का कुल मूल्य',
    statCO2: 'बचाई गई कार्बन गैस (CO2)',
    howItWorks: 'कपड़ाSETU कैसे काम करता है',
    step1Title: '1. इकट्ठा करें और पोस्ट करें',
    step1Desc: 'विक्रेता फोटो खींचते हैं और कपड़े की कतरनों, डेनिम या पुराने कपड़ों को किलोग्राम में लिस्ट करते हैं।',
    step2Title: '2. खोजें और मिलान करें',
    step2Desc: 'रीसाइक्लर्स नक्शे पर दूरी के हिसाब से कपड़ा प्रकार (कपास, सिंथेटिक, मिश्रित) देखकर कचरा ढूंढते हैं।',
    step3Title: '3. सौदा और सुरक्षित भुगतान',
    step3Desc: 'ऍप में मोलभाव करें। सौदा तय होने पर, खरीदार रेज़रपे (Razorpay) से सुरक्षित एस्क्रो में पैसा जमा करता है।',
    step4Title: '4. स्थानीय परिवहन और भुगतान',
    step4Desc: 'टेम्पो या ट्रक बुक करें। माल मिलने पर, दोनों पक्ष जांच करते हैं और पैसा तुरंत विक्रेता को मिल जाता है।',

    // Onboarding
    onboardTitle: 'अपना प्रोफाइल पूरा करें',
    onboardSubtitle: 'भारत के सबसे बड़े कपड़ा रीसाइक्लिंग नेटवर्क का हिस्सा बनें',
    selectRole: 'अपनी प्राथमिक भूमिका चुनें',
    sellerRoleName: 'कपड़ा कचरा विक्रेता',
    sellerRoleDesc: 'दर्जी, बुटीक, कपड़ा मिल या सोसायटी जो अतिरिक्त कटिंग और पुराने कपड़े एकत्र करती है।',
    buyerRoleName: 'रीसाइक्लर / खरीदार',
    buyerRoleDesc: 'मिल मालिक या शिल्पकार जो चिथड़ों को धागे, कंबल, कागज या औद्योगिक भराव में बदलते हैं।',
    fullName: 'पूरा नाम (संपर्क व्यक्ति)',
    businessName: 'व्यवसाय / दुकान का नाम',
    phone: 'फ़ोन नंबर (+91)',
    pincode: 'पिनकोड (6 अंक)',
    pincodeHelper: 'नक्शे पर दूरी मापने के लिए पिनकोड का उपयोग किया जाता है।',
    addressLine: 'पूरा पता',
    gstin: 'जीएसटीआईएन (GSTIN - वैकल्पिक)',
    registerBtn: 'प्रोफाइल सक्रिय करें',

    // Seller Dashboard
    postWasteTitle: 'कपड़ा कचरे का नया बैच लिस्ट करें',
    clothType: 'कपड़े का प्रकार',
    pureCotton: '100% शुद्ध सूती (Pure Cotton)',
    mixedCloth: 'मिश्रित कपड़े / डेनिम',
    synthetic: 'सिंथेटिक / पॉलिएस्टर जाल',
    otherCloth: 'अन्य / औद्योगिक चिथड़े',
    qtyKg: 'मात्रा (किलोग्राम में)',
    expectedPrice: 'अपेक्षित मूल्य प्रति किग्रा (₹)',
    openToOffers: 'मोलभाव / प्रस्तावों के लिए तैयार',
    conditionNotes: 'सामग्री की स्थिति और छंटनी के नोट्स',
    conditionPlaceholder: 'जैसे- सूखा, साफ बुटीक कतरनें, सफेद और नीले टुकड़े अलग किए गए...',
    postBtn: 'कचरा लिस्टिंग पोस्ट करें',
    myListings: 'मेरी लाइव कचरा लिस्टिंग',
    noListings: 'अभी तक कोई कचरा पोस्ट नहीं किया गया है। ऊपर दी गई बटन से शुरुआत करें!',
    offersReceived: 'लिस्टिंग्स पर प्राप्त प्रस्ताव',
    earnings: 'मेरा बटुआ / कमाई',
    escrowHeld: 'सुरक्षित एस्क्रो राशि',
    totalWithdrawn: 'प्राप्त भुगतान राशि',

    // Buyer Dashboard & Listings
    findWaste: 'स्क्रैप सामग्री के ढेर खोजें',
    filterType: 'कपड़े के प्रकार से फ़िल्टर करें',
    filterDistance: 'अधिकतम दूरी त्रिज्या (किमी)',
    allTypes: 'सभी प्रकार के कपड़े',
    browseList: 'आपके आस-पास सक्रिय कचरा ढेर',
    distanceKm: 'किमी दूर',
    expectedLabel: 'अपेक्षा मूल्य:',
    openOfferLabel: 'मोलभाव के लिए खुला',
    viewDetails: 'मोलभाव और बातचीत करें',
    makeOfferTitle: 'खरीदने का प्रस्ताव भेजें',
    offerPrice: 'प्रस्तावित मूल्य प्रति किग्रा (₹)',
    offerQty: 'प्रस्तावित मात्रा (किग्रा)',
    offerMsg: 'विक्रेता के लिए मोलभाव संदेश',
    submitOffer: 'खरीद प्रस्ताव भेजें',
    backToListings: '← लिस्टिंग पर वापस जाएं',

    // Deal Detail & Timeline
    dealStatusLabel: 'सौदा एस्क्रो चरण:',
    awaitingPayment: 'एस्क्रो भुगतान की प्रतीक्षा है',
    paidEscrow: 'एस्क्रो में सुरक्षित जमा राशि',
    inTransit: 'परिवहन जारी है',
    deliveredStatus: 'वितरित (विक्रेता मंजूरी की प्रतीक्षा)',
    completedStatus: 'सौदा पूरा हुआ और राशि भेज दी गई',
    cancelledStatus: 'लेनदेन रद्द / रिफंड हुआ',
    disputedStatus: 'विवाद / ऑडिट के तहत',
    payWithRazorpay: '₹{amount} सुरक्षित भुगतान करें',
    deliveryAddress: 'डिलिवरी का पता:',
    pickupAddress: 'उठाने का पता:',

    // Transport Bookings
    transportBookingTitle: 'परिवहन और पिकअप सेटअप',
    arrangeTransportBtn: 'स्थानीय डिलीवरी टेम्पो बुक करें',
    vehicleType: 'डिलीवरी वाहन प्रकार चुनें',
    threeWheeler: '3-व्हीलर लोडर (टाटा ज़िप) - ₹400 आधार',
    chotaHathi: 'छोटा हाथी टेम्पो (टाटा एस) - ₹800 आधार',
    pickupTruck: 'पिकअप ट्रक (बोलेरो) - ₹1500 आधार',
    pickupSlot: 'पसंद का पिकअप दिन और समय स्लॉट',
    pickupSlotPlaceholder: 'जैसे, शनिवार सुबह 10:00 बजे',
    estCost: 'अनुमानित परिवहन लागत:',
    providerLabel: 'परिवहन सेवा प्रदाता',
    selfArranged: 'स्व-व्यवस्थित (हम अपने वाहन का उपयोग करेंगे)',
    thirdPartyArranged: 'कपड़ाSETU एक्सप्रेस लॉजिस्टिक्स',
    bookTransportConfirm: 'कार्गो पिकअप निर्धारित करें',
    transitDetails: 'परिवहन ट्रैकिंग नोट्स',
    markDispatched: 'सामान भेज दिया गया मार्क करें',
    markDelivered: 'सामान वितरण की पुष्टि करें',

    // Trust / Reviews
    ratingTitle: 'लेनदेन को रेट करें',
    submitReview: 'दोतरफा समीक्षा सबमिट करें',
    commentLabel: 'समीक्षा टिप्पणी',
    reviewerRoleLabel: 'इस रूप में समीक्षा की:',
    raiseDisputeBtn: 'मंच पर विवाद दर्ज करें',
    disputeReason: 'विवाद का कारण (दोष, गीला कपड़ा, वजन में अंतर, आदि)',
    disputePending: 'विवाद दर्ज किया गया है। एडमिन समीक्षा कर रहे हैं।',

    // Admin Center
    adminTitle: 'कपड़ाSETU एडमिन डैशबोर्ड',
    totalPlatformDeals: 'कुल एकत्रित कमीशन',
    disputesTitle: 'अनसुलझे एस्क्रो विवाद',
    disputeTableDeal: 'सौदा आईडी',
    disputeTableRaisedBy: 'किसने उठाया',
    disputeTableReason: 'कारण',
    resolveRefundBtn: 'विवाद सुलझाएं और खरीदार को रिफंड करें',
    resolveReleaseBtn: 'विवाद सुलझाएं और विक्रेता को भेजें',
    userManagement: 'सत्यापित उपयोगकर्ता और केवाईसी रजिस्ट्री',
    kycStatusLabel: 'केवाईसी स्थिति',
    verifyKyc: 'केवाईसी सत्यापित करें',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en'], replace?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('kapada_language');
    return (saved === 'hi' ? 'hi' : 'en') as Language;
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kapada_language', lang);
  };

  const t = (key: keyof typeof translations['en'], replace?: Record<string, string>): string => {
    let str = translations[language][key] || translations['en'][key] || (key as string);
    if (replace) {
      Object.entries(replace).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, v);
      });
    }
    return str;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
