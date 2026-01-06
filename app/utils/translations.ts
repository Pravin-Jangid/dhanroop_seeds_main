// app/utils/translations.ts
import { useEffect, useState } from "react";

export type Language = "hi" | "mr" | "en";

export const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "mr", name: "Marathi", nativeName: "मराठी" },
] as const;

const DEFAULT_LANGUAGE: Language = "hi";

const translations = {
  hi: {
    menu: {
      home: "होम",
      about: "हमारे बारे में",
      products: "उत्पाद",
      media: "मीडिया",
      career: "करियर",
      gallery: "गैलरी",
      contact: "संपर्क करें",
      blogs: "Agri Tips",
    },
    hero: {
      badge: "गुणवत्ता ही पहचान है",
      titleLine1: "भारत का सबसे बड़ा",
      titlePrimary: "प्याज़ और सब्ज़ी",
      titleAccent: "बीज उत्पादक",
      description:
        "उच्च गुणवत्ता वाले हाइब्रिड बीजों के साथ कृषि में क्रांति। 2500+ किसान बेहतरीन उत्पादन और टिकाऊ खेती के लिए हम पर भरोसा करते हैं।",
      explore: "उत्पाद देखें",
      contact: "संपर्क करें",
    },
    footer: {
      description:
        "धनरूप नेचुरल सीड्स प्राइवेट लिमिटेड एक प्रमुख कृषि उत्पाद कंपनी है जो हमारे खाद्य स्रोतों की खेती, सुरक्षा और निरंतरता में क्रांति लाने के लिए समर्पित है।",
      followUs: "हमें फॉलो करें",
      quickLinks: "त्वरित लिंक",
      contactUs: "संपर्क करें",
      ourLocation: "हमारा स्थान",
      callUs: "फोन करें",
      email: "ईमेल",
      business: "व्यवसाय",
      headOffice: "मुख्य कार्यालय",
      qualityTagline: "गुणवत्ता हमारी पहचान है",
      committedTo: "स्थायी कृषि और किसान समृद्धि के लिए प्रतिबद्ध",
      privacyPolicy: "गोपनीयता नीति",
      termsOfService: "सेवा की शर्तें",
      sitemap: "साइटमैप",
      selectLanguage: "भाषा चुनें",
      copyright: "धनरूप सीड्स प्राइवेट लिमिटेड। सर्वाधिकार सुरक्षित।",
      addressLine1: "प्लॉट नंबर 43, गुट नंबर 41,",
      addressLine2: "क्रांति नगर, साजापुर,",
      addressLine3: "सोलापुर-धुले हाईवे,",
      addressLine4: "मिडक वालुज,",
      addressLine5: "छत्रपति संभाजीनगर",
      addressLine6: "(औरंगाबाद),",
      addressLine7: "महाराष्ट्र – 431001",
    },
    products: {
      sectionTitle: "हमारे प्याज़ बीज",
      viewDetails: "विवरण देखें",
      varietiesTitle: "प्याज़ की प्रमुख किस्में",

      gulabiPushp: {
        name: "गुलाबी पुष्प",
        category: "प्याज़ बीज",
        details: [
          "मौसम: रबी प्याज़",
          "बीज दर: 2.5 – 3 किलो / एकड़",
          "प्याज़ रंग: आकर्षक गुलाबी",
          "वजन: 120 – 160 ग्राम",
          "उच्च उत्पादन क्षमता",
        ],
      },

      dollar111: {
        name: "डॉलर-111",
        category: "प्याज़ बीज",
        details: [
          "लंबी शेल्फ लाइफ किस्म",
          "बीज दर: 2.5 – 3 किलो / एकड़",
          "80 – 85 दिन में तैयार",
          "बेहतर बाजार मांग",
        ],
      },

      chinaGold: {
        name: "चायना गोल्ड",
        category: "हाइब्रिड प्याज़ बीज",
        details: [
          "प्रीमियम हाइब्रिड किस्म",
          "एकसमान आकार के प्याज़",
          "उच्च उत्पादकता",
          "मजबूत अंकुरण क्षमता",
        ],
      },
    },
    about: {
      badge: "हमारे बारे में",
      title: "धनरूप प्याज़ बीज",
      subtitle: "मजबूत जड़ें. अधिक उत्पादन.",
      description1:
        "धनरूप प्याज़ बीज भारतीय मिट्टी, जलवायु और खेती की परिस्थितियों के लिए विशेष रूप से विकसित उच्च गुणवत्ता वाले बीज प्रदान करता है।",
      description2:
        "हमारे बीज मजबूत अंकुरण, समान आकार के प्याज़ और लंबी भंडारण क्षमता के लिए किसानों द्वारा भरोसेमंद हैं।",
      points: {
        point1: "उच्च अंकुरण और समान प्याज़ आकार",
        point2: "भारतीय जलवायु व मिट्टी के लिए उपयुक्त",
        point3: "बेहतर भंडारण क्षमता व बाजार मूल्य",
        point4: "किसानों द्वारा गुणवत्ता और उत्पादन के लिए भरोसेमंद",
      },
      imageAlt: "धनरूप प्याज़ बीज खेती",
    },
    achievements: {
      badge: "हमारी उपलब्धियाँ",
      title: "किसानों के साथ मिलकर बढ़ते हुए",
      stats: {
        year: {
          value: "2022",
          label: "स्थापना वर्ष",
        },
        farmers: {
          value: "3000+",
          label: "जुड़े हुए किसान",
        },
        onion: {
          value: "11+",
          label: "प्याज़ की किस्में",
        },
        seeds: {
          value: "100+",
          label: "बीज की किस्में",
        },
      },
    },
    testimonials: {
      badge: "किसानों का विश्वास",
      title: "धनरूप के बारे में किसानों की राय",
    },
    contact: {
      tagline: "भारतीय किसानों के लिए गुणवत्तापूर्ण बीज",
      brand: "धनरूप सीड्स",
      description: "महाराष्ट्र भर में भरोसेमंद उच्च उत्पादन वाले कृषि बीज।",
      phone: "70201 86411",
      region: "महाराष्ट्र",
      imageAlt: "फसलों के साथ किसान",

      formTitle: "त्वरित पूछताछ",
      formSubtitle: "फॉर्म भरें, हमारी टीम आपसे शीघ्र संपर्क करेगी।",

      fields: {
        name: "पूरा नाम",
        phone: "मोबाइल नंबर",
        location: "गांव / जिला",
        crop: "फसल (वैकल्पिक)",
        message: "आपका संदेश",
      },

      submit: "पूछताछ भेजें",
      submitting: "भेजा जा रहा है...",
      success: "✅ आपकी पूछताछ सफलतापूर्वक भेजी गई।",
      error: "❌ कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
    },
    careers: {
      tagline: "हमारी टीम से जुड़ें",
      title: "धनरूप सीड्स में करियर",
      description: "गुणवत्तापूर्ण बीजों से भारतीय किसानों को सशक्त बनाएं।",
      imageAlt: "खेती के साथ किसान",

      formTitle: "नौकरी के लिए आवेदन",
      formSubtitle: "अपनी जानकारी भरें, हम आपसे संपर्क करेंगे।",

      fields: {
        name: "पूरा नाम",
        phone: "मोबाइल नंबर",
        email: "ईमेल पता",
        location: "शहर / जिला",
        position: "आवेदित पद",
        experience: "अनुभव (जैसे 2 वर्ष)",
        coverNote: "हमें आपको क्यों नियुक्त करना चाहिए?",
      },

      submit: "आवेदन करें",
      submitting: "भेजा जा रहा है...",
      success: "✅ आपका आवेदन सफलतापूर्वक भेज दिया गया है।",
      error: "❌ कुछ गलत हुआ। कृपया पुनः प्रयास करें।",
    },
    youtube: {
      badge: "वीडियो सामग्री",
      title: "यूट्यूब पर धनरूप",
      description:
        "बीज गुणवत्ता, खेती तकनीक और किसानों की सफलता की कहानियों पर हमारे नवीनतम वीडियो देखें।",
      watch: "अभी देखें",
      subscribe: "हमारे यूट्यूब चैनल को सब्सक्राइब करें",
      open: "यूट्यूब पर खोलें",
    },
    instagram: {
      badge: "सोशल उपस्थिति",
      title: "इंस्टाग्राम पर धनरूप",
      description:
        "किसानों का भरोसा। खेतों में सिद्ध। बीज गुणवत्ता, फसल परिणाम और वास्तविक किसान सफलता की कहानियों के लिए हमें फॉलो करें।",
      follow: "Follow @dhanroopseeds",
    },
    social: {
      badge: "सोशल मीडिया",
      title: "हमारे चैनलों से नवीनतम",
      description:
        "खेती अपडेट, टिप्स और सफलता की कहानियों के लिए हमें फॉलो करें।",
      viewAll: "सभी मीडिया देखें",
      footerNote: "YouTube, Instagram और Facebook पर हमारी पूरी सामग्री देखें",
      openYoutube: "यूट्यूब पर खोलें",

      instagramTitle: "Instagram पोस्ट",
      instagramSubtitle: "दैनिक अपडेट्स के लिए फॉलो करें",
      instagramStories: "किसान सफलता की कहानियाँ",
      instagramStoriesSub: "असली किसानों की असली कहानियाँ",
      viewInstagram: "Instagram पर देखें",
    },
  },

  mr: {
    menu: {
      home: "मुख्यपृष्ठ",
      about: "आमच्याबद्दल",
      products: "उत्पादने",
      media: "मीडिया",
      career: "करिअर",
      gallery: "गॅलरी",
      contact: "संपर्क",
      blogs: "Agri Tips",
    },
    hero: {
      badge: "गुणवत्ता म्हणजे ओळख",
      titleLine1: "भारताचा सर्वात मोठा",
      titlePrimary: "कांदा व भाजीपाला",
      titleAccent: "बीज उत्पादक",
      description:
        "उच्च दर्जाच्या हायब्रिड बियाण्यांसह शेतीत क्रांती. 2500+ शेतकरी उत्कृष्ट उत्पादनासाठी आमच्यावर विश्वास ठेवतात.",
      explore: "उत्पादने पाहा",
      contact: "संपर्क करा",
    },
    footer: {
      description:
        "धनरूप नैसर्गिक बियाणे प्रायव्हेट लिमिटेड ही एक अग्रगण्य कृषी उत्पादन कंपनी आहे जी आपल्या अन्न स्रोतांची लागवड, संरक्षण आणि टिकवून ठेवण्याच्या पद्धतीत क्रांती घडवून आणण्यासाठी समर्पित आहे.",
      followUs: "आम्हाला फॉलो करा",
      quickLinks: "द्रुत दुवे",
      contactUs: "संपर्क साधा",
      ourLocation: "आमचे स्थान",
      callUs: "कॉल करा",
      email: "ईमेल",
      business: "व्यवसाय",
      headOffice: "मुख्य कार्यालय",
      qualityTagline: "गुणवत्ता ही आमची ओळख आहे",
      committedTo: "शाश्वत शेती आणि शेतकरी समृद्धीसाठी वचनबद्ध",
      privacyPolicy: "गोपनीयता धोरण",
      termsOfService: "सेवा अटी",
      sitemap: "साइटमॅप",
      selectLanguage: "भाषा निवडा",
      copyright: "धनरूप सीड्स प्रायव्हेट लिमिटेड. सर्व हक्क राखीव.",
      addressLine1: "प्लॉट क्रमांक 43, गुट क्रमांक 41,",
      addressLine2: "क्रांती नगर, साजापूर,",
      addressLine3: "सोलापूर-धुळे महामार्ग,",
      addressLine4: "मिडक वालुज,",
      addressLine5: "छत्रपती संभाजीनगर",
      addressLine6: "(औरंगाबाद),",
      addressLine7: "महाराष्ट्र – 431001",
    },
    products: {
      sectionTitle: "आमची कांदा बियाणे",
      viewDetails: "तपशील पहा",
      varietiesTitle: "प्रमुख कांदा वाण",

      gulabiPushp: {
        name: "गुलाबी पुष्प",
        category: "कांदा बियाणे",
        details: [
          "हंगाम: रबी कांदा",
          "बियाणे दर: 2.5 – 3 किलो / एकर",
          "आकर्षक गुलाबी रंग",
          "वजन: 120 – 160 ग्रॅम",
          "उच्च उत्पादन क्षमता",
        ],
      },

      dollar111: {
        name: "डॉलर-111",
        category: "कांदा बियाणे",
        details: [
          "दीर्घ शेल्फ लाईफ वाण",
          "बियाणे दर: 2.5 – 3 किलो / एकर",
          "80 – 85 दिवसांत तयार",
          "उत्तम बाजार मागणी",
        ],
      },

      chinaGold: {
        name: "चायना गोल्ड",
        category: "हायब्रिड कांदा बियाणे",
        details: [
          "प्रीमियम हायब्रिड वाण",
          "एकसमान कांदा आकार",
          "उच्च उत्पादकता",
          "मजबूत उगवण क्षमता",
        ],
      },
    },
    about: {
      badge: "आमच्याबद्दल",
      title: "धनरूप कांदा बियाणे",
      subtitle: "मजबूत मुळे. अधिक उत्पादन.",
      description1:
        "धनरूप कांदा बियाणे भारतीय माती, हवामान आणि शेतीच्या परिस्थितीसाठी विकसित उच्च दर्जाची बियाणे पुरवते.",
      description2:
        "मजबूत उगवण, समान कांदा आकार आणि दीर्घ साठवण क्षमतेसाठी आमच्या बियाण्यांवर शेतकरी विश्वास ठेवतात.",
      points: {
        point1: "उच्च उगवण व समान कांदा आकार",
        point2: "भारतीय हवामान व मातीस योग्य",
        point3: "उत्तम साठवण क्षमता व बाजार मूल्य",
        point4: "गुणवत्ता व उत्पादनासाठी शेतकऱ्यांचा विश्वास",
      },
      imageAlt: "धनरूप कांदा बियाणे शेती",
    },
    achievements: {
      badge: "आमची कामगिरी",
      title: "शेतकऱ्यांसोबत एकत्र वाढत आहोत",
      stats: {
        year: {
          value: "2022",
          label: "स्थापना वर्ष",
        },
        farmers: {
          value: "3000+",
          label: "जोडलेले शेतकरी",
        },
        onion: {
          value: "11+",
          label: "कांदा वाण",
        },
        seeds: {
          value: "100+",
          label: "बियाण्याचे प्रकार",
        },
      },
    },
    testimonials: {
      badge: "शेतकऱ्यांचा विश्वास",
      title: "धनरूप बद्दल शेतकऱ्यांचे मत",
    },
    contact: {
      tagline: "भारतीय शेतकऱ्यांसाठी दर्जेदार बियाणे",
      brand: "धनरूप बियाणे",
      description: "महाराष्ट्रभर विश्वासार्ह उच्च उत्पादन बियाणे.",
      phone: "70201 86411",
      region: "महाराष्ट्र",
      imageAlt: "पिकांसह शेतकरी",

      formTitle: "त्वरित चौकशी",
      formSubtitle: "फॉर्म भरा, आमची टीम लवकरच संपर्क साधेल.",

      fields: {
        name: "पूर्ण नाव",
        phone: "मोबाइल नंबर",
        location: "गाव / जिल्हा",
        crop: "पीक (ऐच्छिक)",
        message: "तुमचा संदेश",
      },

      submit: "चौकशी पाठवा",
      submitting: "पाठवत आहे...",
      success: "✅ तुमची चौकशी यशस्वीरित्या पाठवली गेली आहे.",
      error: "❌ काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.",
    },
    careers: {
      tagline: "आमच्या टीममध्ये सामील व्हा",
      title: "धनरूप बियाणे मध्ये करिअर",
      description: "दर्जेदार बियाण्यांद्वारे भारतीय शेतकऱ्यांना सक्षम करा.",
      imageAlt: "शेतीसह शेतकरी",

      formTitle: "नोकरी अर्ज",
      formSubtitle: "तुमची माहिती भरा, आम्ही लवकरच संपर्क करू.",

      fields: {
        name: "पूर्ण नाव",
        phone: "मोबाइल नंबर",
        email: "ईमेल पत्ता",
        location: "शहर / जिल्हा",
        position: "अर्ज केलेले पद",
        experience: "अनुभव (उदा. 2 वर्षे)",
        coverNote: "आम्ही तुम्हाला का नियुक्त करावे?",
      },

      submit: "अर्ज करा",
      submitting: "पाठवत आहे...",
      success: "✅ तुमचा अर्ज यशस्वीरित्या पाठवला गेला आहे.",
      error: "❌ काहीतरी चुकले. कृपया पुन्हा प्रयत्न करा.",
    },
    youtube: {
      badge: "व्हिडिओ सामग्री",
      title: "यूट्यूबवर धनरूप",
      description:
        "बियाण्यांची गुणवत्ता, शेती तंत्रज्ञान आणि शेतकऱ्यांच्या यशोगाथांवरील आमचे व्हिडिओ पहा.",
      watch: "आता पहा",
      subscribe: "आमच्या यूट्यूब चॅनलला सबस्क्राइब करा",
      open: "यूट्यूबवर उघडा",
    },
    instagram: {
      badge: "सामाजिक उपस्थिती",
      title: "इंस्टाग्रामवर धनरूप",
      description:
        "शेतकऱ्यांचा विश्वास. शेतात सिद्ध. बियाण्यांची गुणवत्ता, पीक परिणाम आणि यशोगाथांसाठी आम्हाला फॉलो करा.",
      follow: "Follow @dhanroopseeds",
    },
    social: {
      badge: "सोशल मीडिया",
      title: "आमच्या चॅनेलवरील नवीनतम",
      description: "शेती अपडेट्स, टिप्स आणि यशोगाथांसाठी आम्हाला फॉलो करा.",
      viewAll: "सर्व मीडिया पहा",
      footerNote:
        "YouTube, Instagram आणि Facebook वरील आमची संपूर्ण सामग्री पहा",
      openYoutube: "यूट्यूबवर उघडा",

      instagramTitle: "Instagram पोस्ट",
      instagramSubtitle: "दररोज अपडेट्ससाठी फॉलो करा",
      instagramStories: "शेतकरी यशोगाथा",
      instagramStoriesSub: "खऱ्या शेतकऱ्यांच्या कथा",
      viewInstagram: "Instagram वर पहा",
    },
  },

  en: {
    menu: {
      home: "Home",
      about: "About Us",
      products: "Products",
      media: "Media",
      career: "Career",
      gallery: "Gallery",
      contact: "Contact Us",
      blogs: "Agri Tips",
    },
    hero: {
      badge: "Quality is Identity",
      titleLine1: "India's Largest",
      titlePrimary: "Onion & Vegetable",
      titleAccent: "Seed Producer",
      description:
        "Revolutionizing agriculture with high-quality hybrid seeds. Over 2500+ farmers trust us for exceptional yields and sustainable farming practices.",
      explore: "Explore Products",
      contact: "Contact Us",
    },
    footer: {
      description:
        "Dhanroop Natural Seeds Pvt Ltd is a leading agricultural product company dedicated to revolutionizing the way we cultivate, protect, and sustain our food sources.",
      followUs: "Follow Us",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
      ourLocation: "Our Location",
      callUs: "Call Us",
      email: "Email",
      business: "Business",
      headOffice: "Head Office",
      qualityTagline: "Quality is our identity",
      committedTo: "Committed to sustainable agriculture and farmer prosperity",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      sitemap: "Sitemap",
      selectLanguage: "Select Language",
      copyright: "Dhanroop Seeds Pvt. Ltd. All rights reserved.",
      addressLine1: "Plot No. 43, Gut No. 41,",
      addressLine2: "Kranti Nagar, Sajapur,",
      addressLine3: "Solapur–Dhule Highway,",
      addressLine4: "MIDC Waluj,",
      addressLine5: "Chhatrapati Sambhajinagar",
      addressLine6: "(Aurangabad),",
      addressLine7: "Maharashtra – 431001",
    },
    products: {
      sectionTitle: "Our Onion Seed Varieties",
      viewDetails: "View Details",
      varietiesTitle: "Popular Onion Varieties",

      gulabiPushp: {
        name: "Gulabi Pushp",
        category: "Onion Seeds",
        details: [
          "Season: Rabi Onion",
          "Seed Rate: 2.5 – 3 kg / acre",
          "Attractive Pink Bulbs",
          "Bulb Weight: 120 – 160 gm",
          "High Yield Potential",
        ],
      },

      dollar111: {
        name: "Dollar-111",
        category: "Onion Seeds",
        details: [
          "Long Shelf Life Variety",
          "Seed Rate: 2.5 – 3 kg / acre",
          "Ready in 80 – 85 days",
          "Excellent Market Demand",
        ],
      },

      chinaGold: {
        name: "China Gold",
        category: "Hybrid Onion Seeds",
        details: [
          "Premium Hybrid Variety",
          "Uniform Bulb Size",
          "High Productivity",
          "Strong Germination Rate",
        ],
      },
    },
    about: {
      badge: "About Us",
      title: "Dhanroop Onion Seeds",
      subtitle: "Strong Roots. Higher Yields.",
      description1:
        "Dhanroop Onion Seeds delivers high-performance seed varieties specially developed for Indian soil, climate, and farming conditions.",
      description2:
        "Our seeds are trusted by farmers for strong germination, uniform bulb formation, and excellent storage life.",
      points: {
        point1: "High germination & uniform bulb size",
        point2: "Suitable for Indian climate & soil",
        point3: "Excellent shelf life & market value",
        point4: "Trusted by farmers for quality & yield",
      },
      imageAlt: "Dhanroop Onion Seeds Farming",
    },
    achievements: {
      badge: "Our Achievements",
      title: "Growing Together With Farmers",
      stats: {
        year: {
          value: "2022",
          label: "Year Established",
        },
        farmers: {
          value: "3000+",
          label: "Farmers Connected",
        },
        onion: {
          value: "11+",
          label: "Onion Varieties",
        },
        seeds: {
          value: "100+",
          label: "Seed Varieties",
        },
      },
    },
    testimonials: {
      badge: "Trusted by Farmers",
      title: "What Farmers Say About Dhanroop",
    },
    contact: {
      tagline: "Quality Seeds for Indian Farmers",
      brand: "Dhanroop Seeds",
      description: "High-yield agricultural seeds trusted across Maharashtra.",
      phone: "70201 86411",
      region: "Maharashtra",
      imageAlt: "Farmer with crops",

      formTitle: "Quick Enquiry",
      formSubtitle: "Fill the form and our team will contact you shortly.",

      fields: {
        name: "Full Name",
        phone: "Mobile Number",
        location: "Village / District",
        crop: "Crop (Optional)",
        message: "Your Message",
      },

      submit: "Submit Enquiry",
      submitting: "Submitting...",
      success: "✅ Enquiry submitted successfully.",
      error: "❌ Something went wrong. Please try again.",
    },
    careers: {
      tagline: "Join Our Team",
      title: "Careers at Dhanroop Seeds",
      description: "Help us empower Indian farmers with quality seeds.",
      imageAlt: "Farmer with crops",

      formTitle: "Job Application",
      formSubtitle: "Fill in your details and we’ll get back to you.",

      fields: {
        name: "Full Name",
        phone: "Mobile Number",
        email: "Email Address",
        location: "City / District",
        position: "Applied Position",
        experience: "Experience (e.g. 2 Years)",
        coverNote: "Why should we hire you?",
      },

      submit: "Apply Now",
      submitting: "Submitting...",
      success: "✅ Application submitted successfully.",
      error: "❌ Something went wrong. Please try again.",
    },
    youtube: {
      badge: "Video Content",
      title: "Dhanroop on YouTube",
      description:
        "Watch our latest videos on seed quality, farming techniques, and success stories from farmers across India.",
      watch: "Watch Now",
      subscribe: "Subscribe to our YouTube Channel",
      open: "Open on YouTube",
    },
    instagram: {
      badge: "Social Presence",
      title: "Dhanroop on Instagram",
      description:
        "Trusted by farmers. Proven in fields. Follow us for seed quality, crop results, and real farm success stories.",
      follow: "Follow @dhanroopseeds",
    },
    social: {
      badge: "Social Media",
      title: "Latest From Our Channels",
      description: "Follow us for updates, farming tips, and success stories.",
      viewAll: "View All Media",
      footerNote:
        "Explore all our YouTube videos, Instagram posts, and Facebook reels",
      openYoutube: "Open on YouTube",

      instagramTitle: "Instagram Post",
      instagramSubtitle: "Follow us for daily updates",
      instagramStories: "Farm Success Stories",
      instagramStoriesSub: "Real stories from real farmers",
      viewInstagram: "View on Instagram",
    },  
  },
} as const;

/* ---------- LANGUAGE SYSTEM ---------- */

let currentLang: Language = DEFAULT_LANGUAGE;
let isInitialized = false;
const listeners = new Set<() => void>();

// Function to initialize language (only on client)
const initializeLanguage = () => {
  if (typeof window !== "undefined" && !isInitialized) {
    const savedLang = localStorage.getItem("lang") as Language;
    if (savedLang && ["hi", "mr", "en"].includes(savedLang)) {
      currentLang = savedLang;
    }
    isInitialized = true;
  }
};

export const setLanguage = (lang: Language) => {
  currentLang = lang;
  if (typeof window !== "undefined") {
    localStorage.setItem("lang", lang);
    isInitialized = true;
  }
  listeners.forEach((fn) => fn()); // Notify all listeners
};

export const getLanguage = (): Language => {
  if (typeof window !== "undefined" && !isInitialized) {
    initializeLanguage();
  }
  return currentLang;
};

// FIXED: Return a cleanup function that returns void
export const subscribeLanguage = (fn: () => void): (() => void) => {
  listeners.add(fn);
  // Return a function that returns void (not boolean)
  return () => {
    listeners.delete(fn);
  };
};

/* ---------- TRANSLATE FUNCTION ---------- */
export const t = (key: string): string => {
  const keys = key.split(".");
  let value: any = translations[currentLang];

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }

  // Fallback to English if translation not found
  if (value === undefined) {
    value = translations.en;
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
  }

  return value ?? key;
};

// Type-safe type definitions for translations
type TranslationKeys = {
  hi: typeof translations.hi;
  mr: typeof translations.mr;
  en: typeof translations.en;
};

// Helper function to get nested translation
type NestedKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${K & string}.${NestedKeys<T[K]> & string}`
        : K;
    }[keyof T]
  : never;

export type TranslationKey = NestedKeys<TranslationKeys[Language]>;

// Helper hook for components to use - FIXED cleanup function
export const useLanguage = () => {
  const [lang, setLang] = useState<Language>(getLanguage());

  useEffect(() => {
    const unsubscribe = subscribeLanguage(() => {
      setLang(getLanguage());
    });

    // FIXED: Return a proper cleanup function that returns void
    return () => {
      unsubscribe();
    };
  }, []);

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
    setLang(newLang);
  };

  return {
    lang,
    setLanguage: changeLanguage,
    languages,
  };
};

// Type-safe t function alternative (optional)
export const translate = <K extends TranslationKey>(key: K): string => {
  return t(key);
};

// Hook to get translations in a component
export const useTranslations = () => {
  const { lang } = useLanguage();

  return {
    t: (key: string) => t(key),
    currentLanguage: lang,
    languages,
    setLanguage,
  };
};

// Server-side safe function for Next.js
export const getServerLanguage = (): Language => {
  // For server-side rendering, default to Hindi
  return DEFAULT_LANGUAGE;
};
