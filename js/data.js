// ====================== TEAMS ======================
const TEAMS = [
  { id: 1, name: "Galatasaray", shortName: "GS", color: "#e8262a", color2: "#f5a623", badge: "⭐", budget: 50000, wageBudget: 6000, stadium: "RAMS Park", capacity: 52280, prestige: 95 },
  { id: 2, name: "Fenerbahçe", shortName: "FB", color: "#003f96", color2: "#f5c000", badge: "🦅", budget: 45000, wageBudget: 5500, stadium: "Ülker Stadyumu", capacity: 50509, prestige: 94 },
  { id: 3, name: "Beşiktaş", shortName: "BJK", color: "#000000", color2: "#c8c8c8", badge: "🦅", budget: 35000, wageBudget: 4500, stadium: "Tüpraş Stadyumu", capacity: 42584, prestige: 90 },
  { id: 4, name: "Trabzonspor", shortName: "TS", color: "#8b0000", color2: "#1a237e", badge: "🌊", budget: 20000, wageBudget: 2800, stadium: "Papara Park", capacity: 40806, prestige: 82 },
  { id: 5, name: "Başakşehir FK", shortName: "IBFK", color: "#ff6600", color2: "#003366", badge: "🏙️", budget: 18000, wageBudget: 2500, stadium: "Başakşehir Fatih Terim St.", capacity: 17319, prestige: 78 },
  { id: 6, name: "Kasımpaşa", shortName: "KSP", color: "#004d99", color2: "#cc0000", badge: "⚓", budget: 12000, wageBudget: 2000, stadium: "Recep Tayyip Erdoğan St.", capacity: 14234, prestige: 68 },
  { id: 7, name: "Samsunspor", shortName: "SAM", color: "#cc0000", color2: "#003366", badge: "🔴", budget: 10000, wageBudget: 1500, stadium: "Samsun 19 Mayıs Stadyumu", capacity: 33919, prestige: 65 },
  { id: 8, name: "Sivasspor", shortName: "SİV", color: "#cc0000", color2: "#f5c000", badge: "🦁", budget: 8000, wageBudget: 1200, stadium: "4 Eylül Stadyumu", capacity: 27994, prestige: 62 },
  { id: 9, name: "Alanyaspor", shortName: "ALA", color: "#ff6600", color2: "#000000", badge: "🏖️", budget: 8000, wageBudget: 1200, stadium: "Bahçeşehir Okul Stadı", capacity: 11600, prestige: 60 },
  { id: 10, name: "Gaziantep FK", shortName: "GFK", color: "#cc0000", color2: "#ff9900", badge: "🏛️", budget: 6000, wageBudget: 1000, stadium: "Gaziantep Stadyumu", capacity: 33000, prestige: 58 }
];

// ====================== FORMATIONS ======================
const FORMATIONS = {
  "4-4-2": {
    name: "4-4-2", slots: ["GK","RB","CB","CB","LB","RM","CM","CM","LM","ST","ST"],
    coords: [
      {x:50,y:88},{x:80,y:70},{x:60,y:73},{x:40,y:73},{x:20,y:70},
      {x:80,y:50},{x:60,y:50},{x:40,y:50},{x:20,y:50},
      {x:60,y:22},{x:40,y:22}
    ]
  },
  "4-3-3": {
    name: "4-3-3", slots: ["GK","RB","CB","CB","LB","CM","CM","CM","RW","ST","LW"],
    coords: [
      {x:50,y:88},{x:80,y:70},{x:60,y:73},{x:40,y:73},{x:20,y:70},
      {x:70,y:50},{x:50,y:52},{x:30,y:50},
      {x:80,y:22},{x:50,y:18},{x:20,y:22}
    ]
  },
  "4-2-3-1": {
    name: "4-2-3-1", slots: ["GK","RB","CB","CB","LB","DM","DM","RW","CAM","LW","ST"],
    coords: [
      {x:50,y:88},{x:80,y:70},{x:60,y:73},{x:40,y:73},{x:20,y:70},
      {x:65,y:57},{x:35,y:57},
      {x:80,y:38},{x:50,y:35},{x:20,y:38},
      {x:50,y:18}
    ]
  },
  "3-5-2": {
    name: "3-5-2", slots: ["GK","CB","CB","CB","RM","DM","CM","CM","LM","ST","ST"],
    coords: [
      {x:50,y:88},{x:65,y:73},{x:50,y:75},{x:35,y:73},
      {x:85,y:52},{x:65,y:52},{x:50,y:50},{x:35,y:52},{x:15,y:52},
      {x:62,y:22},{x:38,y:22}
    ]
  },
  "3-4-3": {
    name: "3-4-3", slots: ["GK","CB","CB","CB","RM","CM","CM","LM","RW","ST","LW"],
    coords: [
      {x:50,y:88},{x:65,y:73},{x:50,y:75},{x:35,y:73},
      {x:82,y:52},{x:60,y:52},{x:40,y:52},{x:18,y:52},
      {x:80,y:22},{x:50,y:18},{x:20,y:22}
    ]
  },
  "5-3-2": {
    name: "5-3-2", slots: ["GK","RWB","CB","CB","CB","LWB","CM","CM","CM","ST","ST"],
    coords: [
      {x:50,y:88},{x:85,y:65},{x:68,y:73},{x:50,y:75},{x:32,y:73},{x:15,y:65},
      {x:70,y:50},{x:50,y:52},{x:30,y:50},
      {x:62,y:22},{x:38,y:22}
    ]
  }
};

const POSITION_COMPAT = {
  GK:  { GK:100 },
  RB:  { RB:100, CB:70, RM:65, CM:55 },
  CB:  { CB:100, RB:70, LB:70, DM:55 },
  LB:  { LB:100, CB:70, LM:65, CM:55 },
  RM:  { RM:100, RW:90, CM:75, RB:65, CAM:70 },
  LM:  { LM:100, LW:90, CM:75, LB:65, CAM:70 },
  DM:  { DM:100, CM:75, CB:55 },
  CM:  { CM:100, DM:80, CAM:80, RM:70, LM:70 },
  CAM: { CAM:100, CM:80, RW:70, LW:70, ST:65 },
  RW:  { RW:100, RM:90, CAM:75, ST:60, LW:65 },
  LW:  { LW:100, LM:90, CAM:75, ST:60, RW:65 },
  ST:  { ST:100, CAM:70, RW:60, LW:60 },
  RWB: { RWB:100, RB:90, RM:80 },
  LWB: { LWB:100, LB:90, LM:80 }
};

// ====================== PLAYERS ======================
// [id, name, age, nat, pos, pos2, pac, sho, pas, dri, def, phy, val(k€), wage(k€/mo), contractEnd, teamId]
const PLAYERS_RAW = [
  // ===== GALATASARAY (1) =====
  [1,"Fernando Muslera",38,"URY","GK",null,52,20,61,55,28,62,1000,80,2025,1],
  [2,"Günay Güvenç",27,"TUR","GK",null,58,18,63,57,25,65,3500,35,2026,1],
  [3,"Sacha Boey",24,"FRA","RB","RM",85,62,72,76,74,72,20000,65,2028,1],
  [4,"Davinson Sánchez",28,"COL","CB",null,82,42,65,55,84,86,22000,150,2026,1],
  [5,"Victor Nelsson",27,"DEN","CB",null,74,40,68,52,82,80,16000,100,2027,1],
  [6,"Abdülkerim Bardakcı",28,"TUR","CB",null,72,35,63,48,80,78,9000,70,2027,1],
  [7,"Angeliño",27,"ESP","LB",null,75,65,78,75,75,68,16000,120,2026,1],
  [8,"Barış Alper Yılmaz",24,"TUR","RW","RB",88,72,70,82,52,68,14000,65,2027,1],
  [9,"Lucas Torreira",28,"URY","DM","CM",65,68,80,74,82,78,25000,200,2025,1],
  [10,"Sérgio Oliveira",32,"POR","CM","DM",60,74,82,72,72,74,8000,100,2026,1],
  [11,"Kerem Demirbay",31,"GER","CM","CAM",62,72,84,75,60,68,9000,90,2025,1],
  [12,"Wilfried Zaha",32,"CIV","LW","RW",86,76,72,88,45,74,12000,180,2026,1],
  [13,"Kerem Aktürkoğlu",26,"TUR","LW",null,84,74,72,84,42,65,16000,100,2027,1],
  [14,"Dries Mertens",37,"BEL","CAM",null,72,82,86,84,36,60,3000,150,2025,1],
  [15,"Hakim Ziyech",31,"MAR","CAM","RW",78,82,84,84,35,64,8000,180,2025,1],
  [16,"Victor Osimhen",25,"NGA","ST",null,93,88,68,82,30,86,100000,300,2025,1],
  [17,"Mauro Icardi",31,"ARG","ST",null,72,90,74,76,28,80,12000,350,2026,1],
  [18,"Yunus Akgün",23,"TUR","CM","RW",75,68,70,76,52,65,8000,40,2026,1],
  [19,"Patrick van Aanholt",33,"NED","LB",null,74,60,72,70,72,68,2000,60,2025,1],
  [20,"Jonas Rønning",24,"NOR","CB",null,70,32,60,45,72,74,3000,25,2026,1],

  // ===== FENERBAHÇE (2) =====
  [21,"Dominik Livaković",29,"CRO","GK",null,64,22,68,62,32,68,18000,120,2027,2],
  [22,"İrfan Can Eğribayat",28,"TUR","GK",null,58,18,63,57,25,62,4000,30,2026,2],
  [23,"Osayi-Samuel",26,"NGA","RB",null,88,60,68,80,68,76,12000,80,2027,2],
  [24,"Çağlar Söyüncü",28,"TUR","CB",null,76,42,70,60,83,80,20000,140,2027,2],
  [25,"Rodrigo Becão",30,"BRA","CB",null,78,40,65,55,82,82,12000,90,2026,2],
  [26,"Alexander Djiku",30,"GHA","CB",null,80,38,65,55,83,84,10000,80,2025,2],
  [27,"Ferdi Kadıoğlu",25,"TUR","LB","CM",78,65,78,78,74,68,22000,120,2027,2],
  [28,"Jayden Oosterwolde",23,"NED","LB",null,82,62,72,76,70,72,10000,70,2027,2],
  [29,"Fred",31,"BRA","DM","CM",72,62,82,72,80,78,12000,150,2025,2],
  [30,"İsmail Yüksek",23,"TUR","CM",null,74,66,74,72,66,70,6000,45,2027,2],
  [31,"Sebastian Szymanski",25,"POL","CAM","CM",76,74,80,78,52,68,14000,90,2027,2],
  [32,"İrfan Can Kahveci",29,"TUR","CM","RW",76,72,76,76,60,68,10000,90,2026,2],
  [33,"Cengiz Ünder",27,"TUR","RW",null,86,74,72,82,42,68,15000,100,2027,2],
  [34,"Dusan Tadic",35,"SRB","LW","CAM",72,74,84,82,45,62,6000,120,2025,2],
  [35,"Edin Džeko",38,"BIH","ST",null,64,82,76,72,34,74,2000,80,2025,2],
  [36,"Youssef En-Nesyri",27,"MAR","ST",null,84,82,70,76,35,80,20000,150,2027,2],
  [37,"Michy Batshuayi",31,"BEL","ST",null,76,80,65,72,32,72,5000,80,2025,2],
  [38,"Lincoln Henrique",25,"BRA","RW","CM",82,68,72,80,45,65,6000,55,2027,2],
  [39,"Mert Müldür",25,"TUR","RB",null,80,62,68,72,68,70,8000,60,2026,2],
  [40,"Mert Hakan Yandaş",28,"TUR","CM",null,72,66,74,70,64,70,6000,70,2026,2],

  // ===== BEŞİKTAŞ (3) =====
  [41,"Mert Günok",35,"TUR","GK",null,54,20,65,58,26,64,2000,60,2025,3],
  [42,"Ersin Destanoğlu",23,"TUR","GK",null,60,18,62,60,24,62,6000,40,2027,3],
  [43,"Valentin Rosier",29,"FRA","RB",null,80,60,70,74,70,74,6000,55,2025,3],
  [44,"Gabriel Paulista",33,"BRA","CB",null,74,38,64,50,82,82,5000,70,2025,3],
  [45,"Romain Saïss",34,"MAR","CB",null,72,42,70,55,82,80,4000,65,2026,3],
  [46,"Amir Rrahmani",30,"KOS","CB",null,78,42,68,55,84,82,14000,80,2026,3],
  [47,"Arthur Masuaku",30,"COD","LB",null,78,58,70,72,68,70,5000,55,2025,3],
  [48,"Mihailo Ristić",28,"SRB","LB",null,76,60,72,70,70,68,5000,50,2026,3],
  [49,"Al-Musrati",28,"LBA","DM","CM",68,60,78,70,80,78,8000,70,2026,3],
  [50,"Salih Uçan",30,"TUR","CM",null,68,65,76,70,65,68,4000,50,2025,3],
  [51,"Gedson Fernandes",25,"POR","CM",null,76,68,76,76,68,75,12000,80,2027,3],
  [52,"João Mário",31,"POR","CM",null,68,68,82,74,62,65,5000,80,2026,3],
  [53,"Ernest Muçi",23,"ALB","RW","ST",86,74,68,80,38,66,8000,55,2027,3],
  [54,"Milot Rashica",27,"KOS","RW","LW",84,72,70,82,40,68,7000,60,2025,3],
  [55,"Tayfur Bingöl",20,"TUR","CM",null,72,60,68,70,55,62,3000,20,2027,3],
  [56,"Ciro Immobile",34,"ITA","ST",null,76,86,70,72,28,72,6000,180,2026,3],
  [57,"Cenk Tosun",33,"TUR","ST",null,72,78,65,68,32,74,3000,80,2025,3],
  [58,"Christoph Baumgartner",24,"AUT","CAM",null,76,74,78,78,50,68,16000,80,2027,3],
  [59,"Carlos Ponce",22,"ESP","CM",null,70,62,72,70,58,65,4000,35,2027,3],
  [60,"Kartal Kayra Uras",21,"TUR","ST",null,74,68,62,70,30,65,2000,20,2026,3],

  // ===== TRABZONSPOR (4) =====
  [61,"Uğurcan Çakır",28,"TUR","GK",null,64,22,70,62,32,68,18000,80,2026,4],
  [62,"Zahid Mubariz",24,"AZE","GK",null,55,18,60,52,24,60,1500,20,2026,4],
  [63,"Gastón Álvarez",25,"URY","RB",null,78,58,68,72,70,72,6000,45,2026,4],
  [64,"Stefan Šavić",33,"MNE","CB",null,74,42,68,55,82,82,5000,80,2025,4],
  [65,"Marc Bartra",33,"ESP","CB",null,72,42,74,60,80,76,4000,70,2025,4],
  [66,"Bernardo",32,"BRA","CB",null,75,38,65,50,80,80,5000,60,2025,4],
  [67,"Abdülkadir Parmak",26,"TUR","LB",null,74,58,68,68,68,65,4000,35,2026,4],
  [68,"Ivanildo Fernandes",24,"GNB","DM","CM",70,55,72,68,76,74,5000,40,2026,4],
  [69,"Okay Yokuşlu",30,"TUR","DM","CM",68,62,76,70,78,76,7000,60,2025,4],
  [70,"Anastasios Bakasetas",29,"GRE","CAM","CM",74,74,80,76,55,68,8000,65,2025,4],
  [71,"John Lundstram",29,"ENG","CM",null,74,62,74,68,72,76,6000,60,2025,4],
  [72,"Yusuf Yazıcı",27,"TUR","CAM","CM",76,78,80,80,48,66,18000,80,2026,4],
  [73,"Trezeguet",29,"EGY","RW",null,84,72,70,80,42,65,8000,70,2025,4],
  [74,"Nicolas Pepe",29,"CIV","RW","LW",88,76,70,88,40,70,8000,80,2025,4],
  [75,"Enis Destan",24,"TUR","LW",null,80,68,68,76,42,62,5000,40,2026,4],
  [76,"Simon Banza",28,"CGO","ST",null,80,80,65,72,32,78,10000,65,2026,4],
  [77,"Maxi Gómez",28,"URY","ST",null,78,78,68,70,35,80,8000,75,2025,4],
  [78,"Muhammed Cham",24,"GAM","RW",null,84,68,66,80,40,65,5000,40,2026,4],
  [79,"Souleymane Doumbia",22,"CIV","CM",null,74,62,70,72,60,68,4000,35,2026,4],
  [80,"Mikael Soisalo",23,"FIN","RW",null,84,68,66,78,38,65,6000,40,2027,4],

  // ===== BAŞAKŞEHİR (5) =====
  [81,"Mert Ateş",29,"TUR","GK",null,58,20,62,55,26,62,2000,30,2025,5],
  [82,"Muhammed Şengezer",26,"TUR","GK",null,56,18,60,53,24,60,1000,20,2026,5],
  [83,"Junior Caiçara",35,"BRA","RB",null,72,55,65,68,68,68,1000,40,2025,5],
  [84,"Carlos Ponck",27,"NED","CB",null,75,38,65,52,78,76,5000,45,2026,5],
  [85,"Leo Duarte",28,"BRA","CB",null,78,38,65,52,80,80,5000,50,2026,5],
  [86,"Kaan Ayhan",29,"GER","CB",null,72,38,68,52,80,76,7000,60,2026,5],
  [87,"İbrahim Akdağ",26,"TUR","LB",null,72,55,66,66,66,65,3000,30,2026,5],
  [88,"Berkay Özcan",26,"GER","CM",null,72,68,74,72,60,65,6000,55,2026,5],
  [89,"Ahmet Oğuz",27,"TUR","CM",null,68,65,72,68,62,68,4000,40,2025,5],
  [90,"Okechukwu Azubuike",25,"NGA","DM",null,68,52,68,64,72,76,3000,35,2026,5],
  [91,"Kerim Frei",31,"AUT","RW","CAM",78,68,72,76,42,65,3000,35,2025,5],
  [92,"Rafael Ratão",28,"BRA","LW",null,82,72,70,80,40,65,5000,45,2025,5],
  [93,"Emmanuel Boateng",27,"GHA","RW",null,84,68,65,78,40,64,4000,40,2025,5],
  [94,"Giuliano",36,"BRA","CAM",null,68,70,78,76,42,58,2000,50,2025,5],
  [95,"Ercan Kara",28,"AUT","ST",null,70,76,62,68,35,76,5000,55,2026,5],
  [96,"Harun Bulut",26,"TUR","ST",null,72,74,63,68,32,72,4000,40,2026,5],
  [97,"Mbaye Diagne",33,"SEN","ST",null,74,78,60,68,32,74,3000,45,2025,5],
  [98,"Baran Orhan",21,"TUR","CM",null,68,60,66,68,55,62,2000,15,2027,5],
  [99,"Furkan Soyalp",22,"TUR","RW",null,74,65,64,72,40,62,2000,18,2027,5],
  [100,"Nadir Çiftçi",31,"TUR","ST",null,70,72,62,68,32,68,2000,35,2025,5],

  // ===== KASIMPAŞA (6) =====
  [101,"Serkan Kırıntılı",31,"TUR","GK",null,55,18,60,52,24,60,1500,25,2025,6],
  [102,"Ramazan Özcan",35,"AUT","GK",null,54,18,58,50,22,62,800,20,2025,6],
  [103,"Hamza Akman",24,"TUR","RB",null,74,58,65,68,68,68,2000,25,2026,6],
  [104,"Rodrigues",28,"BRA","CB",null,75,38,62,50,78,78,3000,40,2025,6],
  [105,"Simon Colley",23,"GAM","CB",null,74,35,60,48,76,78,2500,35,2026,6],
  [106,"Lasse Berg Johnsen",26,"NOR","CB",null,72,35,64,50,76,74,2500,30,2026,6],
  [107,"Gökhan Gönül",39,"TUR","RB",null,64,52,68,62,68,62,800,30,2025,6],
  [108,"Saeid Ezatolahi",27,"IRN","CM","DM",72,62,74,68,72,72,5000,50,2026,6],
  [109,"Sofian Chakla",32,"MAR","CB",null,70,36,62,48,76,74,2000,35,2025,6],
  [110,"Gideon Mensah",25,"GHA","LB",null,78,55,65,72,65,68,3000,35,2026,6],
  [111,"Ömer Bayram",31,"TUR","RB",null,74,60,66,68,68,68,3500,40,2025,6],
  [112,"Moses Simon",28,"NGA","LW",null,88,70,70,84,40,68,10000,65,2027,6],
  [113,"Majid Hosseini",26,"IRN","CB",null,76,36,64,50,78,76,5000,45,2026,6],
  [114,"Muhammed Berkay Kılıçsoy",18,"TUR","ST",null,78,76,64,76,30,64,8000,25,2027,6],
  [115,"Bonke Innocent",27,"TAN","DM","CM",70,58,70,66,74,74,3000,35,2025,6],
  [116,"Hyun-jun Suk",27,"KOR","ST",null,76,74,64,70,35,72,4000,45,2026,6],
  [117,"Stelios Kitsiou",29,"GRE","RB",null,76,60,66,70,66,68,3000,35,2025,6],
  [118,"Mame Biram Diouf",36,"SEN","ST","RW",80,72,62,70,38,76,1000,40,2025,6],
  [119,"Youssuf Mulumbu",32,"COD","CM",null,68,60,72,68,68,70,1500,30,2025,6],
  [120,"Ferhat Öztorun",23,"TUR","CM",null,66,58,68,66,60,63,1500,18,2026,6],

  // ===== SAMSUNSPOR (7) =====
  [121,"Gürcan Kulaksızoğlu",32,"TUR","GK",null,56,18,60,52,24,62,1500,25,2025,7],
  [122,"Milan Borjan",36,"CAN","GK",null,58,20,62,55,26,66,1000,30,2025,7],
  [123,"Amir Hadziahmetovic",27,"BIH","CM","DM",70,65,74,68,70,72,5000,45,2026,7],
  [124,"Christian Gytkjaer",34,"DEN","ST",null,72,78,62,66,30,74,2000,50,2025,7],
  [125,"Sedat Agçay",27,"TUR","CB",null,72,36,62,48,76,74,2000,25,2026,7],
  [126,"Ahmet Canbaz",25,"TUR","CM",null,70,62,70,68,62,68,2500,25,2026,7],
  [127,"Alioune Ndour",24,"SEN","CM",null,74,62,70,70,60,70,3000,30,2026,7],
  [128,"Yusuf Erdoğan",24,"TUR","RB",null,74,58,65,66,66,66,2000,20,2026,7],
  [129,"Ali Gholizadeh",27,"IRN","RW","LW",84,68,68,80,40,64,6000,45,2026,7],
  [130,"Gökhan Töre",32,"TUR","RW",null,80,70,68,80,42,65,2000,35,2025,7],
  [131,"Aleksandar Živković",29,"SRB","RW",null,82,70,68,78,40,65,5000,40,2025,7],
  [132,"Omar Govea",28,"MEX","CM",null,72,64,72,70,60,68,3000,35,2025,7],
  [133,"Samuel Essende",25,"CMR","ST",null,80,76,62,70,32,78,4000,40,2026,7],
  [134,"Habib Ballo",25,"CIV","LW",null,84,68,66,80,38,65,4000,40,2026,7],
  [135,"Miloš Degenek",30,"AUS","CB",null,72,36,64,50,76,74,3000,35,2025,7],
  [136,"Metehan Altunbaş",22,"TUR","CM",null,70,60,68,68,58,65,1500,18,2026,7],
  [137,"İlhan Parlak",31,"TUR","ST","LW",74,72,65,70,35,68,2500,35,2025,7],
  [138,"Emre Demir",21,"TUR","RW",null,78,66,64,76,38,62,4000,20,2027,7],
  [139,"Mehmet Uslu",24,"TUR","CB",null,70,35,60,48,74,72,1500,20,2026,7],
  [140,"José Sosa",38,"ARG","CM",null,58,62,76,68,58,62,1000,30,2025,7],

  // ===== SİVASSPOR (8) =====
  [141,"Mamadou Samassa",28,"MLI","GK",null,60,20,62,55,26,66,2000,30,2026,8],
  [142,"Emre Karakoç",25,"TUR","GK",null,55,18,58,52,24,60,1000,18,2026,8],
  [143,"Umar Sadiq",27,"NGA","ST",null,84,78,65,76,32,80,12000,60,2025,8],
  [144,"Cüneyt Köz",28,"TUR","RB",null,72,58,65,66,66,66,2000,25,2026,8],
  [145,"Hakan Arslan",29,"TUR","CM",null,68,62,72,66,65,68,3000,30,2025,8],
  [146,"Emre Taşdemir",27,"TUR","LB",null,72,56,65,66,65,66,2000,22,2026,8],
  [147,"Olarenwaju Kayode",30,"NGA","ST",null,82,74,62,74,32,74,3000,35,2025,8],
  [148,"Koray Altınay",24,"TUR","CB",null,70,34,60,46,74,72,1500,18,2026,8],
  [149,"İbrahim Şanlı",25,"TUR","CM",null,70,62,70,68,62,65,1500,20,2026,8],
  [150,"Max Gradel",36,"CIV","RW",null,80,68,66,78,40,64,1000,30,2025,8],
  [151,"Abdülkadir Sünger",26,"TUR","LB",null,72,55,65,66,66,65,2000,22,2025,8],
  [152,"Rey Manaj",28,"ALB","ST",null,80,76,62,72,32,72,6000,45,2026,8],
  [153,"Papa Alioune Ndiaye",29,"SEN","CM",null,74,64,72,68,65,70,4000,40,2025,8],
  [154,"Mostafa Alijani",23,"IRN","RW",null,78,66,64,74,40,62,3000,30,2026,8],
  [155,"Mergen Morozov",26,"KAZ","CB",null,72,35,62,48,76,74,2000,25,2026,8],
  [156,"Recep Niyaz",31,"TUR","LW",null,74,66,66,72,42,62,2000,25,2025,8],
  [157,"Claudemir",36,"BRA","DM",null,62,58,72,65,72,70,800,25,2025,8],
  [158,"Erdoğan Yeşilyurt",22,"TUR","CM",null,68,60,66,66,58,63,1000,15,2027,8],
  [159,"Oluwasemilogo Adekunle",23,"NGA","ST",null,80,72,62,72,30,72,3000,30,2026,8],
  [160,"Koray Erdoğan",24,"TUR","CB",null,70,34,60,46,74,70,1500,18,2026,8],

  // ===== ALANYASPOR (9) =====
  [161,"Kamil Ahmet Çörekçi",31,"TUR","GK",null,58,20,62,55,26,62,1500,25,2025,9],
  [162,"Berke Özer",23,"TUR","GK",null,58,18,60,55,24,62,3000,22,2026,9],
  [163,"Davidson",29,"BRA","CB",null,76,38,64,50,80,80,5000,45,2025,9],
  [164,"Boli Bolingoli",29,"BEL","LB",null,78,58,68,72,68,68,5000,40,2026,9],
  [165,"Mert Çetin",26,"TUR","CB",null,74,36,62,48,78,76,5000,40,2026,9],
  [166,"Efecan Karaca",25,"TUR","CM",null,70,62,68,68,60,65,2000,20,2026,9],
  [167,"Emir Ortaköylü",24,"TUR","RW",null,78,65,64,74,40,64,2500,22,2026,9],
  [168,"Lourency",27,"BRA","CM",null,72,64,70,70,60,68,4000,35,2025,9],
  [169,"Cebrail Karayel",26,"TUR","CB",null,72,35,60,48,76,72,2000,20,2026,9],
  [170,"Tayfun Ünal",28,"TUR","DM",null,66,55,68,64,72,70,2000,22,2025,9],
  [171,"Welinton Jr.",22,"BRA","ST",null,78,72,62,70,30,72,4000,30,2026,9],
  [172,"Kenny Rocha Santos",26,"CPV","CM",null,72,62,72,70,60,68,4000,35,2026,9],
  [173,"Efkan Bekiroğlu",25,"TUR","CM",null,70,62,68,66,60,65,2500,22,2026,9],
  [174,"Abdoulaye Diaby",28,"MLI","LW",null,84,70,66,80,38,64,5000,40,2025,9],
  [175,"Yusuf Sarı",25,"TUR","RB",null,74,56,64,66,66,65,2000,20,2026,9],
  [176,"Isak Ssewankambo",27,"SWE","LB",null,76,58,66,70,66,66,3000,30,2025,9],
  [177,"Soner Dikmen",29,"TUR","CB",null,70,34,60,46,74,70,1500,20,2025,9],
  [178,"Ahmet Karataş",23,"TUR","LW",null,76,64,64,72,40,62,2000,18,2026,9],
  [179,"Yakup Alkan",21,"TUR","ST",null,74,68,60,68,30,65,1500,15,2027,9],
  [180,"Mustafa Pektemek",32,"TUR","ST",null,68,74,62,66,32,70,2000,30,2025,9],

  // ===== GAZİANTEP FK (10) =====
  [181,"Özgür Çek",30,"TUR","GK",null,56,18,60,52,24,62,1000,20,2025,10],
  [182,"Ertuğrul Taşkıran",27,"TUR","GK",null,54,18,58,50,22,60,800,15,2026,10],
  [183,"Bilal Başacıkoğlu",30,"TUR","RW",null,78,68,68,76,40,64,3000,30,2025,10],
  [184,"Hamidou Dramé",27,"GUI","CB",null,74,35,62,48,78,78,3000,35,2025,10],
  [185,"Luan Silva",26,"BRA","CB",null,74,36,62,50,76,76,3000,30,2026,10],
  [186,"Sinan Bakış",27,"LUX","ST",null,76,72,62,68,32,72,4000,35,2026,10],
  [187,"Stefan Mugosa",32,"MNE","ST",null,72,72,60,66,30,70,2000,30,2025,10],
  [188,"Fouad Bachirou",33,"COM","DM",null,66,58,70,65,72,70,2000,30,2025,10],
  [189,"Erdal Rakip",27,"SWE","CM",null,74,64,72,70,60,65,3500,35,2025,10],
  [190,"Patric Pfeiffer",26,"GER","CB",null,74,36,64,50,78,76,4000,35,2026,10],
  [191,"Muhammed Taş",24,"TUR","LB",null,72,55,64,65,65,65,1500,18,2026,10],
  [192,"Giorgi Beridze",24,"GEO","RW",null,80,66,64,76,40,62,3000,28,2026,10],
  [193,"Nabil Aankour",24,"MAR","LW",null,78,66,66,76,40,63,2500,25,2026,10],
  [194,"Haluk Adıgüzel",26,"TUR","RB",null,72,55,64,64,65,64,1500,18,2026,10],
  [195,"Deniz Kadah",30,"TUR","ST",null,70,68,62,66,32,68,2000,25,2025,10],
  [196,"Jean Eudes Aholou",32,"CIV","DM",null,68,58,70,65,72,70,2000,30,2025,10],
  [197,"Moryke Fofana",32,"CIV","LW",null,78,66,66,76,38,64,1500,25,2025,10],
  [198,"Tolgay Arslan",33,"TUR","CM",null,62,58,72,65,65,65,1000,25,2025,10],
  [199,"Muhammed Gümüşkaya",25,"TUR","CM",null,68,60,66,65,60,65,1500,18,2026,10],
  [200,"Talbi",22,"MAR","CB",null,74,35,62,50,76,74,2500,25,2026,10]
];

// Convert raw array to objects
function buildPlayers(raw) {
  return raw.map(r => ({
    id: r[0], name: r[1], age: r[2], nat: r[3],
    pos: r[4], pos2: r[5],
    pac: r[6], sho: r[7], pas: r[8], dri: r[9], def: r[10], phy: r[11],
    value: r[12], wage: r[13], contractEnd: r[14], teamId: r[15],
    fitness: 90 + Math.floor(Math.random()*10),
    morale: 60 + Math.floor(Math.random()*30),
    form: [6,6,6,6,6],
    injured: false, injuryDays: 0,
    yellowCards: 0, suspended: false,
    transferListed: false, onLoan: false
  }));
}

const PLAYERS_INIT = buildPlayers(PLAYERS_RAW);

// Overall rating by position
function calcOverall(p, slotPos) {
  const pos = slotPos || p.pos;
  const weights = {
    GK:  [0.15,0.05,0.15,0.10,0.40,0.15],
    CB:  [0.15,0.05,0.10,0.05,0.40,0.25],
    RB:  [0.25,0.05,0.20,0.15,0.25,0.10],
    LB:  [0.25,0.05,0.20,0.15,0.25,0.10],
    DM:  [0.10,0.05,0.25,0.10,0.30,0.20],
    CM:  [0.10,0.05,0.30,0.20,0.20,0.15],
    CAM: [0.15,0.20,0.25,0.25,0.05,0.10],
    RM:  [0.25,0.15,0.18,0.22,0.10,0.10],
    LM:  [0.25,0.15,0.18,0.22,0.10,0.10],
    RW:  [0.28,0.20,0.15,0.25,0.05,0.07],
    LW:  [0.28,0.20,0.15,0.25,0.05,0.07],
    ST:  [0.20,0.35,0.08,0.20,0.03,0.14],
    RWB: [0.25,0.05,0.18,0.17,0.25,0.10],
    LWB: [0.25,0.05,0.18,0.17,0.25,0.10]
  };
  const w = weights[pos] || weights.CM;
  const compat = POSITION_COMPAT[slotPos] && POSITION_COMPAT[slotPos][p.pos]
    ? POSITION_COMPAT[slotPos][p.pos] / 100 : 1;
  const raw = p.pac*w[0] + p.sho*w[1] + p.pas*w[2] + p.dri*w[3] + p.def*w[4] + p.phy*w[5];
  return Math.round(raw * compat);
}

// Free agents pool (players not in any team)
const FREE_AGENTS_RAW = [
  [201,"Adnan Januzaj",29,"BEL","RW","LW",80,70,72,82,38,62,4000,45,2025,null],
  [202,"Graziano Pellè",38,"ITA","ST",null,68,74,62,66,30,72,500,25,2025,null],
  [203,"Robbie Keane",44,"IRL","ST",null,60,72,64,66,30,62,200,10,2025,null],
  [204,"Bonaventure Kalou",38,"CIV","RW",null,76,68,65,74,38,62,600,20,2025,null],
  [205,"Moussa Sow",38,"SEN","ST",null,72,70,60,65,28,66,500,18,2025,null],
  [206,"Panagiotis Retsos",24,"GRE","CB",null,76,36,62,50,78,76,4000,30,2025,null],
  [207,"Álvaro Morata",31,"ESP","ST",null,78,80,70,72,32,74,8000,60,2025,null],
  [208,"Divock Origi",29,"BEL","ST","LW",76,74,65,72,32,70,5000,45,2025,null],
  [209,"Memphis Depay",30,"NED","ST","LW",78,80,72,82,38,70,8000,60,2025,null],
  [210,"Kostas Fortounis",32,"GRE","CAM","CM",70,68,74,72,55,65,3000,35,2025,null]
];
const FREE_AGENTS_INIT = buildPlayers(FREE_AGENTS_RAW);

// Generate season fixtures for 10 teams (double round-robin = 18 matchdays)
function generateFixtures() {
  const teams = TEAMS.map(t => t.id);
  const fixtures = [];
  let matchday = 1;
  // Simple round-robin algorithm
  const n = teams.length;
  const half = n / 2;
  const rotate = [...teams.slice(1)];
  for (let round = 0; round < n - 1; round++) {
    const dayMatches = [];
    const fixed = teams[0];
    const arr = [fixed, ...rotate];
    for (let i = 0; i < half; i++) {
      dayMatches.push({ home: arr[i], away: arr[n - 1 - i], matchday, played: false, homeGoals: null, awayGoals: null });
    }
    fixtures.push(...dayMatches);
    matchday++;
    rotate.push(rotate.shift());
  }
  // Return leg
  const firstLeg = [...fixtures];
  for (const m of firstLeg) {
    fixtures.push({ home: m.away, away: m.home, matchday: m.matchday + (n - 1), played: false, homeGoals: null, awayGoals: null });
  }
  return fixtures;
}

const COMMENTARY = {
  goal: [
    "GOOOOOL! Harika bir gol!",
    "Net! Muhteşem bir bitirme!",
    "İnanılmaz! Top ağlarda!",
    "Gol! Seyirciler çılgına döndü!",
    "Mükemmel bir vuruş, defans yenildi!",
    "Beklenmedik bir anda gol geldi!",
  ],
  save: [
    "Harika bir kurtarış! Kaleci muhteşemdi.",
    "İnanılmaz refleks! Kaleci takımını kurtardı.",
    "Top direğe çarptı ve dışarı çıktı!",
    "Çıta! Defans son anda müdahale etti.",
  ],
  yellow: ["Sarı kart görüldü!", "Hakem kartı çıkardı!", "Tehlikeli faul, sarı kart!"],
  red: ["KIRMIZI KART! Oyuncu sahayı terk ediyor!", "Büyük hata, direkt kırmızı kart!"],
  miss: ["Top direğin yanından geçti!", "Kaçan büyük fırsat!", "Kaleci güçlükle kurtardı..."],
  corner: ["Korner!", "Köşe vuruşu kazanıldı."],
  foul: ["Faul!", "Hakem durumu tespit etti."],
  offside: ["Ofsayt! Gol sayılmadı.", "Bayrak kalktı, ofsayt pozisyonu."],
};
