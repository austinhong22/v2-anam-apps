// ================================================================
// COIN 미니앱 전역 설정 및 초기화
// ================================================================

// Coin 설정
const CoinConfig = {
  // 기본 정보
  name: "Solana",
  symbol: "SOL",
  decimals: 9,

  // 네트워크 설정
  network: {
    // Testnet RPC 엔드포인트 (실제 테스트용)
    rpcEndpoint: "https://api.testnet.solana.com",
    // 네트워크 이름
    networkName: "testnet",
    // Solana는 chainId 대신 cluster 사용
    cluster: "testnet",
  },

  // UI 테마 설정
  theme: {
    primaryColor: "#14F195", // 메인 색상 (Solana Green)
    secondaryColor: "#9945FF", // 보조 색상 (Solana Purple)
    logoText: "Solana", // 로고 텍스트
  },

  // 주소 설정
  address: {
    // 주소 형식 정규식 (검증용)
    regex: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    // 주소 표시 형식
    displayFormat: "...", // Base58 형식
  },

  // 트랜잭션 설정
  transaction: {
    // 기본 가스비/수수료
    defaultFee: "0.000005", // 5000 lamports
    // 최소 전송 금액
    minAmount: "0.000001",
    // 확인 대기 시간 (ms)
    confirmationTime: 15000,
  },

  // 기타 옵션
  options: {
    // 니모닉 지원 여부
    supportsMnemonic: true,
    // 토큰 지원 여부 (SPL 토큰)
    supportsTokens: true,
    // QR 코드 지원
    supportsQRCode: true,
  },
};

// Result 객체 클래스
class Result {
  constructor(success, data, error) {
    this.success = success;
    this.data = data;
    this.error = error;
  }

  static success(data) {
    return new Result(true, data, null);
  }

  static failure(error) {
    return new Result(false, null, error);
  }
}

// Mock anamUI (실제 환경에서 없을 때 사용)
if (!window.anamUI) {
  window.anamUI = {
    createKeystore: async (secretKey) => {
      // 간단한 base64 인코딩으로 mock
      return btoa(JSON.stringify(secretKey));
    },
    decryptKeystore: async (keystore) => {
      // base64 디코딩으로 mock
      return JSON.parse(atob(keystore));
    }
  };
}

// 실제 BIP39 니모닉 생성 (외부 라이브러리 사용)
async function generateBIP39Mnemonic() {
  try {
    // 동적 import로 bip39 라이브러리 로드
    const bip39 = await import('bip39');
    return bip39.generateMnemonic(128); // 12단어 니모닉
  } catch (error) {
    console.error("BIP39 니모닉 생성 실패:", error);
    // 폴백: 간단한 니모닉 생성
    return generateSimpleMnemonic();
  }
}

// 간단한 니모닉 생성 (폴백용)
function generateSimpleMnemonic() {
  const words = [
    "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
    "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
    "action", "actor", "actual", "adapt", "add", "addict", "address", "adjust", "admit", "adult",
    "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent", "agree",
    "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert", "alien",
    "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter", "always",
    "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger", "angle",
    "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique", "anxiety",
    "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic", "area",
    "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest", "arrive",
    "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset", "assist",
    "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction", "audit",
    "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake", "aware",
    "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge", "bag",
    "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain", "barrel",
    "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become", "beef",
    "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit", "best",
    "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology", "bird",
    "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless", "blind",
    "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body", "boil",
    "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss", "bottom",
    "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread", "breeze",
    "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze", "broom",
    "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb", "bulk",
    "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "busy", "butter",
    "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call", "calm",
    "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas", "canyon",
    "capable", "capital", "captain", "car", "carbon", "card", "cargo", "carpet", "carry", "cart",
    "case", "cash", "casino", "castle", "casual", "cat", "catalog", "catch", "category", "cause",
    "caution", "cave", "ceiling", "celery", "cement", "census", "century", "cereal", "certain", "chair",
    "chalk", "champion", "change", "chaos", "chapter", "charge", "chase", "chat", "cheap", "check",
    "cheese", "chef", "cherry", "chest", "chicken", "chief", "child", "chimney", "choice", "choose",
    "chronic", "chuckle", "chunk", "churn", "cigar", "cinnamon", "circle", "citizen", "city", "civil",
    "claim", "clap", "clarify", "claw", "clay", "clean", "clerk", "clever", "click", "client",
    "cliff", "climb", "clinic", "clip", "clock", "clog", "close", "cloth", "cloud", "clown",
    "club", "clump", "cluster", "clutch", "coach", "coast", "coconut", "code", "coffee", "coil",
    "coin", "collect", "color", "column", "combine", "come", "comfort", "comic", "common", "company",
    "concert", "conduct", "confirm", "congress", "connect", "consider", "control", "convince", "cook", "cool",
    "copper", "copy", "coral", "core", "corn", "correct", "cost", "cotton", "couch", "country",
    "couple", "course", "cousin", "cover", "coyote", "crack", "cradle", "craft", "cram", "crane",
    "crash", "crater", "crawl", "crazy", "cream", "credit", "creek", "crew", "cricket", "crime",
    "crisp", "critic", "crop", "cross", "crouch", "crowd", "crucial", "cruel", "cruise", "crumble",
    "crunch", "crush", "cry", "crystal", "cube", "culture", "cup", "cupboard", "curious", "curly",
    "curry", "curtain", "curve", "cushion", "custom", "cute", "cycle", "dad", "damage", "dance",
    "danger", "daring", "dash", "daughter", "dawn", "day", "deal", "debate", "debris", "decade",
    "december", "decide", "decline", "decorate", "decrease", "deer", "defense", "define", "defy", "degree",
    "delay", "deliver", "demand", "demise", "denial", "dentist", "deny", "depart", "depend", "deposit",
    "depth", "deputy", "derive", "describe", "desert", "design", "desk", "despair", "destroy", "detail",
    "detect", "develop", "device", "devote", "diagram", "dial", "diamond", "diary", "dice", "diesel",
    "diet", "differ", "digital", "dignity", "dilemma", "dinner", "dinosaur", "direct", "dirt", "disagree",
    "discover", "disease", "dish", "dismiss", "disorder", "display", "distance", "divert", "divide", "divorce",
    "dizzy", "doctor", "document", "dog", "doll", "dolphin", "domain", "donate", "donkey", "donor",
    "door", "dose", "double", "dove", "draft", "dragon", "drama", "drastic", "draw", "dream",
    "dress", "drift", "drill", "drink", "drip", "drive", "drop", "drum", "dry", "duck",
    "dumb", "dune", "during", "dust", "dutch", "duty", "dwarf", "dynamic", "eager", "eagle",
    "early", "earn", "earth", "easily", "east", "easy", "echo", "ecology", "economy", "edge",
    "edit", "educate", "effort", "egg", "eight", "either", "elbow", "elder", "electric", "elegant",
    "element", "elephant", "elevator", "elite", "else", "embark", "embody", "embrace", "emerge", "emotion",
    "employ", "empower", "empty", "enable", "enact", "end", "endless", "endorse", "enemy", "energy",
    "enforce", "engage", "engine", "enhance", "enjoy", "enlist", "enough", "enrich", "enroll", "ensure",
    "enter", "entire", "entry", "envelope", "episode", "equal", "equip", "era", "erase", "erode",
    "erosion", "error", "erupt", "escape", "essay", "essence", "estate", "eternal", "ethics", "evidence",
    "evil", "evoke", "evolve", "exact", "example", "excess", "exchange", "excite", "exclude", "excuse",
    "execute", "exercise", "exhaust", "exhibit", "exile", "exist", "exit", "exotic", "expand", "expect",
    "expire", "explain", "expose", "express", "extend", "extra", "eye", "eyebrow", "fabric", "face",
    "faculty", "fade", "faint", "faith", "fall", "false", "fame", "family", "famous", "fan",
    "fancy", "fantasy", "farm", "fashion", "fat", "fatal", "father", "fatigue", "fault", "favorite",
    "feature", "february", "federal", "fee", "feed", "feel", "female", "fence", "festival", "fetch",
    "fever", "few", "fiber", "fiction", "field", "figure", "file", "film", "filter", "final",
    "find", "fine", "finger", "finish", "fire", "firm", "first", "fiscal", "fish", "fit",
    "five", "fix", "flag", "flame", "flavor", "flee", "flight", "flip", "float", "flock",
    "floor", "flower", "fluid", "flush", "fly", "foam", "focus", "fog", "foil", "fold",
    "follow", "food", "foot", "force", "forest", "forget", "fork", "fortune", "forum", "forward",
    "fossil", "foster", "found", "fox", "fragile", "frame", "frequent", "fresh", "friend", "fringe",
    "frog", "front", "frost", "frown", "frozen", "fruit", "fuel", "fun", "funny", "furnace",
    "fury", "future", "gadget", "gain", "galaxy", "gallery", "game", "gap", "garage", "garbage",
    "garden", "garlic", "garment", "gas", "gasp", "gate", "gather", "gauge", "gaze", "general",
    "genius", "genre", "gentle", "genuine", "gesture", "ghost", "giant", "gift", "giggle", "ginger",
    "giraffe", "girl", "give", "glad", "glance", "glare", "glass", "gleam", "glee", "glide",
    "glimpse", "glint", "glisten", "glitter", "globe", "gloom", "glory", "glove", "glow", "glue",
    "goat", "goddess", "gold", "good", "goose", "gorilla", "gospel", "gossip", "govern", "gown",
    "grab", "grace", "grain", "grant", "grape", "grass", "gravity", "great", "green", "grid",
    "grief", "grit", "grocery", "group", "grow", "grunt", "guard", "guess", "guide", "guilt",
    "guitar", "gun", "gym", "habit", "hair", "half", "hammer", "hamster", "hand", "happy",
    "harbor", "hard", "harsh", "harvest", "hat", "have", "hawk", "hazard", "head", "health",
    "heart", "heavy", "hedgehog", "height", "hello", "helmet", "help", "hen", "hero", "hidden",
    "high", "hill", "hint", "hip", "hire", "history", "hobby", "hockey", "hold", "hole",
    "holiday", "hollow", "home", "honey", "hood", "hope", "horn", "horror", "horse", "hospital",
    "host", "hotel", "hour", "hover", "hub", "huge", "human", "humble", "humor", "hundred",
    "hungry", "hunt", "hurdle", "hurry", "hurt", "husband", "hybrid", "ice", "icon", "idea",
    "identify", "idle", "ignore", "ill", "illegal", "illness", "image", "imitate", "immense", "immune",
    "impact", "impose", "improve", "impulse", "inch", "include", "income", "increase", "index", "indicate",
    "indoor", "industry", "infant", "inflict", "inform", "inhale", "inherit", "initial", "inject", "injury",
    "inmate", "inner", "innocent", "input", "inquiry", "insane", "insect", "inside", "inspire", "install",
    "intact", "interest", "into", "invest", "invite", "involve", "iron", "island", "isolate", "issue",
    "item", "ivory", "jacket", "jaguar", "jar", "jazz", "jealous", "jeans", "jelly", "jewel",
    "job", "join", "joke", "journey", "joy", "judge", "juice", "juicy", "july", "jumbo",
    "jump", "june", "jungle", "junior", "junk", "just", "kangaroo", "keen", "keep", "ketchup",
    "key", "kick", "kid", "kidney", "kind", "kingdom", "kiss", "kit", "kitchen", "kite",
    "kitten", "kiwi", "knee", "knife", "knock", "know", "lab", "label", "labor", "ladder",
    "lady", "lake", "lamp", "language", "laptop", "large", "later", "latin", "laugh", "laundry",
    "lava", "law", "lawn", "lawsuit", "layer", "lazy", "leader", "leaf", "learn", "leave",
    "lecture", "left", "leg", "legal", "legend", "leisure", "lemon", "lend", "length", "lens",
    "leopard", "lesson", "letter", "level", "liar", "liberty", "library", "license", "life", "lift",
    "light", "like", "limb", "limit", "link", "lion", "liquid", "list", "little", "live",
    "lizard", "load", "loan", "lobster", "local", "lock", "logic", "lonely", "long", "loop",
    "lottery", "loud", "lounge", "love", "loyal", "lucky", "luggage", "lumber", "lunar", "lunch",
    "luxury", "lyrics", "machine", "mad", "magic", "magnet", "maid", "mail", "main", "major",
    "make", "mammal", "man", "manage", "mandate", "mango", "mansion", "manual", "maple", "marble", "march",
    "margin", "marine", "market", "marriage", "mask", "mass", "master", "match", "material", "math",
    "matrix", "matter", "maximum", "maze", "meadow", "mean", "measure", "meat", "mechanic", "medal",
    "media", "melody", "melt", "member", "memory", "mention", "menu", "mercy", "merge", "merit",
    "merry", "mesh", "message", "metal", "method", "middle", "midnight", "milk", "million", "mimic",
    "mind", "minimum", "minor", "minute", "miracle", "mirror", "misery", "miss", "mistake", "mix",
    "mixed", "mixture", "mobile", "model", "modify", "mom", "moment", "monitor", "monkey", "monster",
    "month", "moon", "moral", "more", "morning", "mosquito", "mother", "motion", "motor", "mountain",
    "mouse", "move", "movie", "much", "muffin", "mule", "multiply", "muscle", "museum", "mushroom",
    "music", "must", "mutual", "myself", "mystery", "myth", "naive", "name", "napkin", "narrow",
    "nasty", "nation", "nature", "near", "neck", "need", "negative", "neglect", "neither", "nephew",
    "nerve", "nest", "net", "network", "neutral", "never", "news", "next", "nice", "night",
    "noble", "noise", "nominee", "noodle", "normal", "north", "nose", "notable", "note", "nothing",
    "notice", "novel", "now", "nuclear", "number", "nurse", "nut", "oak", "obey", "object",
    "oblige", "obscure", "observe", "obtain", "obvious", "occur", "ocean", "october", "odor", "off",
    "offer", "office", "often", "oil", "okay", "old", "olive", "olympic", "omit", "once",
    "one", "onion", "online", "only", "open", "opera", "opinion", "oppose", "option", "orange",
    "orbit", "orchard", "order", "organ", "orient", "original", "orphan", "ostrich", "other", "outdoor",
    "outer", "output", "outside", "oval", "oven", "over", "own", "owner", "oxygen", "oyster",
    "ozone", "pact", "paddle", "page", "pair", "palace", "palm", "panda", "panel", "panic",
    "panther", "paper", "parade", "parent", "park", "parrot", "party", "pass", "patch", "path",
    "patient", "patrol", "pattern", "pause", "pave", "payment", "peace", "peanut", "pear", "peasant",
    "pelican", "pen", "penalty", "pencil", "people", "pepper", "perfect", "permit", "person", "pet",
    "phone", "photo", "phrase", "physical", "piano", "picnic", "picture", "piece", "pig", "pigeon",
    "pill", "pilot", "pink", "pioneer", "pipe", "pistol", "pitch", "pitcher", "pizza", "place",
    "plague", "planet", "plastic", "plate", "play", "please", "pledge", "pluck", "plug", "plunge",
    "poem", "poet", "point", "polar", "pole", "police", "pond", "pony", "pool", "poor",
    "popular", "portion", "position", "possible", "post", "potato", "pottery", "poverty", "powder", "power",
    "practice", "praise", "predict", "prefer", "prepare", "present", "pretty", "prevent", "price", "pride",
    "primary", "print", "priority", "prison", "private", "prize", "problem", "process", "produce", "profit",
    "program", "project", "promote", "proof", "property", "prosper", "protect", "proud", "provide", "public",
    "pudding", "pull", "pulp", "pulse", "pumpkin", "punch", "pupil", "puppy", "purchase", "purity",
    "purpose", "purse", "push", "put", "puzzle", "pyramid", "quality", "quantum", "quarter", "question",
    "quick", "quit", "quiz", "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio",
    "rail", "rain", "raise", "rally", "ramp", "ranch", "random", "range", "rapid", "rare",
    "rate", "rather", "raven", "raw", "razor", "ready", "real", "reason", "rebel", "rebuild",
    "recall", "receive", "recipe", "record", "recycle", "reduce", "reflect", "reform", "refuse", "region",
    "regret", "regular", "reject", "relax", "release", "relief", "rely", "remain", "remember", "remind",
    "remove", "render", "renew", "rent", "reopen", "repair", "repeat", "replace", "report", "require",
    "rescue", "resemble", "resist", "resource", "response", "result", "retire", "retreat", "return", "reunion",
    "reveal", "review", "reward", "rhythm", "rib", "ribbon", "rice", "rich", "ride", "ridge",
    "rifle", "right", "rigid", "ring", "riot", "ripple", "risk", "ritual", "rival", "river",
    "road", "roast", "robot", "robust", "rocket", "romance", "roof", "rookie", "room", "rose",
    "rotate", "rough", "round", "route", "royal", "rubber", "rude", "rug", "rule", "run",
    "runway", "rural", "sad", "saddle", "sadness", "safe", "sail", "salad", "salmon", "salon",
    "salt", "salute", "same", "sample", "sand", "satisfy", "satoshi", "sauce", "sausage", "save",
    "say", "scale", "scan", "scare", "scatter", "scene", "scheme", "school", "science", "scissors",
    "scorpion", "scout", "scrap", "screen", "script", "scrub", "sea", "search", "season", "seat",
    "second", "secret", "section", "security", "seed", "seek", "segment", "select", "sell", "seminar",
    "senior", "sense", "sentence", "series", "service", "seven", "shadow", "shaft", "shallow", "share",
    "shed", "shell", "sheriff", "shield", "shift", "shine", "ship", "shiver", "shock", "shoe",
    "shoot", "shop", "shore", "short", "shoulder", "shove", "shrimp", "shrug", "shuffle", "shy",
    "sibling", "sick", "side", "siege", "sight", "sign", "silent", "silk", "silly", "silver",
    "similar", "simple", "since", "sing", "siren", "sister", "situate", "six", "size", "skate",
    "sketch", "ski", "skill", "skin", "skirt", "skull", "slab", "slam", "sleep", "slender",
    "slice", "slide", "slight", "slim", "slogan", "slot", "slow", "slush", "small", "smart",
    "smile", "smoke", "smooth", "snack", "snake", "snap", "sniff", "snow", "soap", "soccer",
    "social", "sock", "soda", "soft", "solar", "soldier", "solid", "solution", "solve", "someone",
    "song", "soon", "sorry", "sort", "soul", "sound", "soup", "source", "south", "space",
    "spare", "spatial", "spawn", "speak", "speed", "spell", "spend", "sphere", "spice", "spider",
    "spike", "spin", "spirit", "split", "spoil", "sponsor", "spoon", "sport", "spot", "spray",
    "spread", "spring", "spy", "square", "squeeze", "squirrel", "stable", "stadium", "staff", "stage",
    "stairs", "stamp", "stand", "start", "state", "stay", "steak", "steel", "stem", "step",
    "stereo", "stick", "still", "sting", "stock", "stomach", "stone", "stool", "story", "stove",
    "strategy", "street", "strike", "strong", "struggle", "student", "stuff", "stumble", "stunt", "style",
    "subject", "submit", "subway", "success", "such", "sudden", "suffer", "sugar", "suggest", "suit",
    "summer", "sun", "sunny", "sunset", "super", "supply", "supreme", "sure", "surface", "surge",
    "surprise", "surround", "survey", "suspect", "sustain", "swallow", "swamp", "swap", "swarm", "swear",
    "sweet", "swift", "swim", "swing", "switch", "sword", "symbol", "symptom", "syrup", "system",
    "table", "tackle", "tag", "tail", "talent", "talk", "tank", "tape", "target", "task",
    "taste", "tattoo", "taxi", "teach", "team", "tell", "ten", "tenant", "tennis", "tent",
    "term", "test", "text", "thank", "that", "theme", "then", "theory", "there", "they",
    "thing", "this", "thought", "three", "thrive", "throw", "thumb", "thunder", "ticket", "tide",
    "tiger", "tilt", "timber", "time", "tiny", "tip", "tired", "tissue", "title", "toast",
    "tobacco", "today", "toddler", "toe", "together", "toilet", "token", "tomato", "tomorrow", "tone",
    "tongue", "tonight", "tool", "tooth", "top", "topic", "topple", "torch", "tornado", "tortoise",
    "toss", "total", "tourist", "toward", "tower", "town", "toy", "track", "trade", "traffic",
    "tragic", "train", "transfer", "trap", "trash", "travel", "tray", "treat", "tree", "trend",
    "trial", "tribe", "trick", "trigger", "trim", "trip", "trophy", "trouble", "truck", "true",
    "truly", "trumpet", "trust", "truth", "try", "tube", "tuition", "tumble", "tuna", "tunnel",
    "turkey", "turn", "turtle", "twelve", "twenty", "twice", "twin", "twist", "two", "type",
    "typical", "ugly", "umbrella", "unable", "unaware", "uncle", "uncover", "under", "undo", "unfair",
    "unfold", "unhappy", "uniform", "unique", "unit", "universe", "unknown", "unlock", "until", "unusual",
    "unveil", "update", "upgrade", "uphold", "upon", "upper", "upright", "uprising", "uproar", "upset",
    "upstairs", "upward", "urban", "urge", "usage", "use", "used", "useful", "useless", "usual",
    "utility", "vacant", "vacuum", "vague", "valid", "valley", "valve", "van", "vanish", "vapor",
    "various", "vast", "vault", "vehicle", "velvet", "vendor", "venue", "verb", "verify", "version",
    "very", "vessel", "veteran", "viable", "vibrant", "vicious", "victory", "video", "view", "village",
    "vintage", "violin", "virtual", "virus", "visa", "visit", "visual", "vital", "vivid", "vocal",
    "voice", "void", "volcano", "volume", "vote", "voucher", "vow", "vowel", "voyage", "wage",
    "wagon", "wait", "walk", "wall", "walnut", "want", "warfare", "warm", "warrior", "wash",
    "wasp", "waste", "water", "wave", "way", "wealth", "weapon", "wear", "weasel", "weather",
    "web", "wedding", "weekend", "weird", "welcome", "west", "wet", "whale", "what", "whatever",
    "wheat", "wheel", "when", "whenever", "where", "whereas", "wherever", "whether", "which", "whiff",
    "while", "whilst", "whisper", "wide", "width", "wife", "wild", "will", "willing", "win",
    "window", "wine", "wing", "wink", "winner", "winter", "wire", "wisdom", "wise", "wish",
    "witness", "wolf", "woman", "wonder", "wood", "wool", "word", "work", "world", "worry",
    "worth", "would", "wound", "wrangle", "wrap", "wreath", "wreck", "wrestle", "wrist", "write",
    "wrong", "yard", "year", "yellow", "you", "young", "youth", "zebra", "zero", "zone",
    "zoo"
  ];
  
  // 12단어 니모닉 생성
  const mnemonic = [];
  for (let i = 0; i < 12; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    mnemonic.push(words[randomIndex]);
  }
  
  return mnemonic.join(' ');
}

// Coin Adapter 추상 클래스
// 모든 블록체인 지갑이 구현해야 하는 공통 인터페이스
class CoinAdapter {
  constructor(config) {
    if (this.constructor === CoinAdapter) {
      throw new Error(
        "CoinAdapter is an abstract class. Cannot be instantiated directly."
      );
    }
    this.config = config;
  }

  /* ================================================================
   * 1. 지갑 생성 및 관리
   * ================================================================ */

  /**
   * 새 지갑 생성
   * @returns {Promise<Result>}
   */
  async generateWallet() {
    throw new Error("generateWallet() method must be implemented.");
  }

  /**
   * 니모닉으로 지갑 복구
   * @param {string} mnemonic - 니모닉 구문
   * @returns {Promise<Result>}
   */
  async importFromMnemonic(mnemonic) {
    throw new Error("importFromMnemonic() method must be implemented.");
  }

  /**
   * 개인키로 지갑 복구
   * @param {string} privateKey - 개인키
   * @returns {Promise<Result>}
   */
  async importFromPrivateKey(privateKey) {
    throw new Error("importFromPrivateKey() method must be implemented.");
  }

  /**
   * 주소 유효성 검증
   * @param {string} address - 검증할 주소
   * @returns {boolean}
   */
  isValidAddress(address) {
    throw new Error("isValidAddress() method must be implemented.");
  }

  /* ================================================================
   * 2. 잔액 조회
   * ================================================================ */

  /**
   * 주소의 잔액 조회
   * @param {string} address - 조회할 주소
   * @returns {Promise<Result>} - 잔액 (SOL 단위)
   */
  async getBalance(address) {
    throw new Error("getBalance() method must be implemented.");
  }

  /* ================================================================
   * 3. 트랜잭션 처리
   * ================================================================ */

  /**
   * 트랜잭션 전송
   * @param {string} to - 받는 주소
   * @param {string} lamports - 전송할 lamports
   * @returns {Promise<Result>}
   */
  async sendTx(to, lamports) {
    throw new Error("sendTx() method must be implemented.");
  }

  /**
   * 트랜잭션 히스토리 조회
   * @param {string} address - 조회할 주소
   * @returns {Promise<Result>}
   */
  async getHistory(address) {
    throw new Error("getHistory() method must be implemented.");
  }

  /**
   * 트랜잭션 상태 조회
   * @param {string} txHash - 트랜잭션 해시
   * @returns {Promise<Result>}
   */
  async getTransactionStatus(txHash) {
    throw new Error("getTransactionStatus() method must be implemented.");
  }

  /* ================================================================
   * 4. 수수료 관련
   * ================================================================ */

  /**
   * 현재 네트워크 수수료 조회
   * @returns {Promise<Result>}
   */
  async getGasPrice() {
    throw new Error("getGasPrice() method must be implemented.");
  }

  /**
   * 트랜잭션 수수료 예상
   * @param {Object} txParams - 트랜잭션 파라미터
   * @returns {Promise<Result>}
   */
  async estimateFee(txParams) {
    throw new Error("estimateFee() method must be implemented.");
  }
}

// ================================================================
// Solana Adapter 구현
// ================================================================

// Solana 어댑터 구현
class SolanaAdapter extends CoinAdapter {
  constructor(config) {
    super(config);
    this.connection = null;
  }

  // RPC 연결 초기화
  async initProvider() {
    if (!this.connection) {
      this.connection = new solanaWeb3.Connection(
        this.config.network.rpcEndpoint,
        "confirmed"
      );
    }
    return this.connection;
  }

  /**
   * 새 지갑 생성
   * @returns {Promise<Result>}
   */
  async generateWallet() {
    try {
      // 먼저 니모닉 생성
      const mnemonic = this.generateSimpleMnemonic();
      
      // 니모닉에서 키페어 생성 (일관성 유지)
      const seed = this.mnemonicToSeed(mnemonic);
      const keypair = solanaWeb3.Keypair.fromSeed(seed.slice(0, 32));
      
      // secretKey를 암호화하여 저장
      const secretKey = Array.from(keypair.secretKey);
      const keystore = await window.anamUI.createKeystore(secretKey);
      
      return Result.success({
        address: keypair.publicKey.toString(),
        secretKey: keystore,
        publicKey: keypair.publicKey.toString(),
        mnemonic: mnemonic,
      });
    } catch (error) {
      console.error("지갑 생성 실패:", error);
      return Result.failure(error.message);
    }
  }

  /**
   * 실제 BIP39 니모닉 생성
   * @returns {Promise<string>}
   */
  async generateBIP39Mnemonic() {
    try {
      // 브라우저에서 Buffer polyfill 추가
      if (typeof window !== 'undefined' && !window.Buffer) {
        window.Buffer = require('buffer').Buffer;
      }
      
      // 동적 import로 bip39 라이브러리 로드
      const bip39 = await import('bip39');
      return bip39.generateMnemonic(128); // 12단어 니모닉
    } catch (error) {
      console.error("BIP39 니모닉 생성 실패:", error);
      // 폴백: 간단한 니모닉 생성
      return this.generateSimpleMnemonic();
    }
  }

  /**
   * 간단한 니모닉 생성 (폴백용)
   * @returns {string}
   */
  generateSimpleMnemonic() {
    const words = [
      "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
      "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
      "action", "actor", "actual", "adapt", "add", "addict", "address", "adjust", "admit", "adult",
      "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent", "agree",
      "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert", "alien",
      "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter", "always",
      "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger", "angle",
      "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique", "anxiety",
      "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic", "area",
      "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest", "arrive",
      "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset", "assist",
      "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction", "audit",
      "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake", "aware",
      "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge", "bag",
      "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain", "barrel",
      "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become", "beef",
      "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit", "best",
      "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology", "bird",
      "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless", "blind",
      "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body", "boil",
      "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss", "bottom",
      "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread", "breeze",
      "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze", "broom",
      "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb", "bulk",
      "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "busy", "butter",
      "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call", "calm",
      "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas", "canyon",
      "capable", "capital", "captain", "car", "carbon", "card", "cargo", "carpet", "carry", "cart",
      "case", "cash", "casino", "castle", "casual", "cat", "catalog", "catch", "category", "cause",
      "caution", "cave", "ceiling", "celery", "cement", "census", "century", "cereal", "certain", "chair",
      "chalk", "champion", "change", "chaos", "chapter", "charge", "chase", "chat", "cheap", "check",
      "cheese", "chef", "cherry", "chest", "chicken", "chief", "child", "chimney", "choice", "choose",
      "chronic", "chuckle", "chunk", "churn", "cigar", "cinnamon", "circle", "citizen", "city", "civil",
      "claim", "clap", "clarify", "claw", "clay", "clean", "clerk", "clever", "click", "client",
      "cliff", "climb", "clinic", "clip", "clock", "clog", "close", "cloth", "cloud", "clown",
      "club", "clump", "cluster", "clutch", "coach", "coast", "coconut", "code", "coffee", "coil",
      "coin", "collect", "color", "column", "combine", "come", "comfort", "comic", "common", "company",
      "concert", "conduct", "confirm", "congress", "connect", "consider", "control", "convince", "cook", "cool",
      "copper", "copy", "coral", "core", "corn", "correct", "cost", "cotton", "couch", "country",
      "couple", "course", "cousin", "cover", "coyote", "crack", "cradle", "craft", "cram", "crane",
      "crash", "crater", "crawl", "crazy", "cream", "credit", "creek", "crew", "cricket", "crime",
      "crisp", "critic", "crop", "cross", "crouch", "crowd", "crucial", "cruel", "cruise", "crumble",
      "crunch", "crush", "cry", "crystal", "cube", "culture", "cup", "cupboard", "curious", "curly",
      "curry", "curtain", "curve", "cushion", "custom", "cute", "cycle", "dad", "damage", "dance",
      "danger", "daring", "dash", "daughter", "dawn", "day", "deal", "debate", "debris", "decade",
      "december", "decide", "decline", "decorate", "decrease", "deer", "defense", "define", "defy", "degree",
      "delay", "deliver", "demand", "demise", "denial", "dentist", "deny", "depart", "depend", "deposit",
      "depth", "deputy", "derive", "describe", "desert", "design", "desk", "despair", "destroy", "detail",
      "detect", "develop", "device", "devote", "diagram", "dial", "diamond", "diary", "dice", "diesel",
      "diet", "differ", "digital", "dignity", "dilemma", "dinner", "dinosaur", "direct", "dirt", "disagree",
      "discover", "disease", "dish", "dismiss", "disorder", "display", "distance", "divert", "divide", "divorce",
      "dizzy", "doctor", "document", "dog", "doll", "dolphin", "domain", "donate", "donkey", "donor",
      "door", "dose", "double", "dove", "draft", "dragon", "drama", "drastic", "draw", "dream",
      "dress", "drift", "drill", "drink", "drip", "drive", "drop", "drum", "dry", "duck",
      "dumb", "dune", "during", "dust", "dutch", "duty", "dwarf", "dynamic", "eager", "eagle",
      "early", "earn", "earth", "easily", "east", "easy", "echo", "ecology", "economy", "edge",
      "edit", "educate", "effort", "egg", "eight", "either", "elbow", "elder", "electric", "elegant",
      "element", "elephant", "elevator", "elite", "else", "embark", "embody", "embrace", "emerge", "emotion",
      "employ", "empower", "empty", "enable", "enact", "end", "endless", "endorse", "enemy", "energy",
      "enforce", "engage", "engine", "enhance", "enjoy", "enlist", "enough", "enrich", "enroll", "ensure",
      "enter", "entire", "entry", "envelope", "episode", "equal", "equip", "era", "erase", "erode",
      "erosion", "error", "erupt", "escape", "essay", "essence", "estate", "eternal", "ethics", "evidence",
      "evil", "evoke", "evolve", "exact", "example", "excess", "exchange", "excite", "exclude", "excuse",
      "execute", "exercise", "exhaust", "exhibit", "exile", "exist", "exit", "exotic", "expand", "expect",
      "expire", "explain", "expose", "express", "extend", "extra", "eye", "eyebrow", "fabric", "face",
      "faculty", "fade", "faint", "faith", "fall", "false", "fame", "family", "famous", "fan",
      "fancy", "fantasy", "farm", "fashion", "fat", "fatal", "father", "fatigue", "fault", "favorite",
      "feature", "february", "federal", "fee", "feed", "feel", "female", "fence", "festival", "fetch",
      "fever", "few", "fiber", "fiction", "field", "figure", "file", "film", "filter", "final",
      "find", "fine", "finger", "finish", "fire", "firm", "first", "fiscal", "fish", "fit",
      "five", "fix", "flag", "flame", "flavor", "flee", "flight", "flip", "float", "flock",
      "floor", "flower", "fluid", "flush", "fly", "foam", "focus", "fog", "foil", "fold",
      "follow", "food", "foot", "force", "forest", "forget", "fork", "fortune", "forum", "forward",
      "fossil", "foster", "found", "fox", "fragile", "frame", "frequent", "fresh", "friend", "fringe",
      "frog", "front", "frost", "frown", "frozen", "fruit", "fuel", "fun", "funny", "furnace",
      "fury", "future", "gadget", "gain", "galaxy", "gallery", "game", "gap", "garage", "garbage",
      "garden", "garlic", "garment", "gas", "gasp", "gate", "gather", "gauge", "gaze", "general",
      "genius", "genre", "gentle", "genuine", "gesture", "ghost", "giant", "gift", "giggle", "ginger",
      "giraffe", "girl", "give", "glad", "glance", "glare", "glass", "gleam", "glee", "glide",
      "glimpse", "glint", "glisten", "glitter", "globe", "gloom", "glory", "glove", "glow", "glue",
      "goat", "goddess", "gold", "good", "goose", "gorilla", "gospel", "gossip", "govern", "gown",
      "grab", "grace", "grain", "grant", "grape", "grass", "gravity", "great", "green", "grid",
      "grief", "grit", "grocery", "group", "grow", "grunt", "guard", "guess", "guide", "guilt",
      "guitar", "gun", "gym", "habit", "hair", "half", "hammer", "hamster", "hand", "happy",
      "harbor", "hard", "harsh", "harvest", "hat", "have", "hawk", "hazard", "head", "health",
      "heart", "heavy", "hedgehog", "height", "hello", "helmet", "help", "hen", "hero", "hidden",
      "high", "hill", "hint", "hip", "hire", "history", "hobby", "hockey", "hold", "hole",
      "holiday", "hollow", "home", "honey", "hood", "hope", "horn", "horror", "horse", "hospital",
      "host", "hotel", "hour", "hover", "hub", "huge", "human", "humble", "humor", "hundred",
      "hungry", "hunt", "hurdle", "hurry", "hurt", "husband", "hybrid", "ice", "icon", "idea",
      "identify", "idle", "ignore", "ill", "illegal", "illness", "image", "imitate", "immense", "immune",
      "impact", "impose", "improve", "impulse", "inch", "include", "income", "increase", "index", "indicate",
      "indoor", "industry", "infant", "inflict", "inform", "inhale", "inherit", "initial", "inject", "injury",
      "inmate", "inner", "innocent", "input", "inquiry", "insane", "insect", "inside", "inspire", "install",
      "intact", "interest", "into", "invest", "invite", "involve", "iron", "island", "isolate", "issue",
      "item", "ivory", "jacket", "jaguar", "jar", "jazz", "jealous", "jeans", "jelly", "jewel",
      "job", "join", "joke", "journey", "joy", "judge", "juice", "juicy", "july", "jumbo",
      "jump", "june", "jungle", "junior", "junk", "just", "kangaroo", "keen", "keep", "ketchup",
      "key", "kick", "kid", "kidney", "kind", "kingdom", "kiss", "kit", "kitchen", "kite",
      "kitten", "kiwi", "knee", "knife", "knock", "know", "lab", "label", "labor", "ladder",
      "lady", "lake", "lamp", "language", "laptop", "large", "later", "latin", "laugh", "laundry",
      "lava", "law", "lawn", "lawsuit", "layer", "lazy", "leader", "leaf", "learn", "leave",
      "lecture", "left", "leg", "legal", "legend", "leisure", "lemon", "lend", "length", "lens",
      "leopard", "lesson", "letter", "level", "liar", "liberty", "library", "license", "life", "lift",
      "light", "like", "limb", "limit", "link", "lion", "liquid", "list", "little", "live",
      "lizard", "load", "loan", "lobster", "local", "lock", "logic", "lonely", "long", "loop",
      "lottery", "loud", "lounge", "love", "loyal", "lucky", "luggage", "lumber", "lunar", "lunch",
      "luxury", "lyrics", "machine", "mad", "magic", "magnet", "maid", "mail", "main", "major",
      "make", "mammal", "man", "manage", "mandate", "mango", "mansion", "manual", "maple", "marble", "march",
      "margin", "marine", "market", "marriage", "mask", "mass", "master", "match", "material", "math",
      "matrix", "matter", "maximum", "maze", "meadow", "mean", "measure", "meat", "mechanic", "medal",
      "media", "melody", "melt", "member", "memory", "mention", "menu", "mercy", "merge", "merit",
      "merry", "mesh", "message", "metal", "method", "middle", "midnight", "milk", "million", "mimic",
      "mind", "minimum", "minor", "minute", "miracle", "mirror", "misery", "miss", "mistake", "mix",
      "mixed", "mixture", "mobile", "model", "modify", "mom", "moment", "monitor", "monkey", "monster",
      "month", "moon", "moral", "more", "morning", "mosquito", "mother", "motion", "motor", "mountain",
      "mouse", "move", "movie", "much", "muffin", "mule", "multiply", "muscle", "museum", "mushroom",
      "music", "must", "mutual", "myself", "mystery", "myth", "naive", "name", "napkin", "narrow",
      "nasty", "nation", "nature", "near", "neck", "need", "negative", "neglect", "neither", "nephew",
      "nerve", "nest", "net", "network", "neutral", "never", "news", "next", "nice", "night",
      "noble", "noise", "nominee", "noodle", "normal", "north", "nose", "notable", "note", "nothing",
      "notice", "novel", "now", "nuclear", "number", "nurse", "nut", "oak", "obey", "object",
      "oblige", "obscure", "observe", "obtain", "obvious", "occur", "ocean", "october", "odor", "off",
      "offer", "office", "often", "oil", "okay", "old", "olive", "olympic", "omit", "once",
      "one", "onion", "online", "only", "open", "opera", "opinion", "oppose", "option", "orange",
      "orbit", "orchard", "order", "organ", "orient", "original", "orphan", "ostrich", "other", "outdoor",
      "outer", "output", "outside", "oval", "oven", "over", "own", "owner", "oxygen", "oyster",
      "ozone", "pact", "paddle", "page", "pair", "palace", "palm", "panda", "panel", "panic",
      "panther", "paper", "parade", "parent", "park", "parrot", "party", "pass", "patch", "path",
      "patient", "patrol", "pattern", "pause", "pave", "payment", "peace", "peanut", "pear", "peasant",
      "pelican", "pen", "penalty", "pencil", "people", "pepper", "perfect", "permit", "person", "pet",
      "phone", "photo", "phrase", "physical", "piano", "picnic", "picture", "piece", "pig", "pigeon",
      "pill", "pilot", "pink", "pioneer", "pipe", "pistol", "pitch", "pitcher", "pizza", "place",
      "plague", "planet", "plastic", "plate", "play", "please", "pledge", "pluck", "plug", "plunge",
      "poem", "poet", "point", "polar", "pole", "police", "pond", "pony", "pool", "poor",
      "popular", "portion", "position", "possible", "post", "potato", "pottery", "poverty", "powder", "power",
      "practice", "praise", "predict", "prefer", "prepare", "present", "pretty", "prevent", "price", "pride",
      "primary", "print", "priority", "prison", "private", "prize", "problem", "process", "produce", "profit",
      "program", "project", "promote", "proof", "property", "prosper", "protect", "proud", "provide", "public",
      "pudding", "pull", "pulp", "pulse", "pumpkin", "punch", "pupil", "puppy", "purchase", "purity",
      "purpose", "purse", "push", "put", "puzzle", "pyramid", "quality", "quantum", "quarter", "question",
      "quick", "quit", "quiz", "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio",
      "rail", "rain", "raise", "rally", "ramp", "ranch", "random", "range", "rapid", "rare",
      "rate", "rather", "raven", "raw", "razor", "ready", "real", "reason", "rebel", "rebuild",
      "recall", "receive", "recipe", "record", "recycle", "reduce", "reflect", "reform", "refuse", "region",
      "regret", "regular", "reject", "relax", "release", "relief", "rely", "remain", "remember", "remind",
      "remove", "render", "renew", "rent", "reopen", "repair", "repeat", "replace", "report", "require",
      "rescue", "resemble", "resist", "resource", "response", "result", "retire", "retreat", "return", "reunion",
      "reveal", "review", "reward", "rhythm", "rib", "ribbon", "rice", "rich", "ride", "ridge",
      "rifle", "right", "rigid", "ring", "riot", "ripple", "risk", "ritual", "rival", "river",
      "road", "roast", "robot", "robust", "rocket", "romance", "roof", "rookie", "room", "rose",
      "rotate", "rough", "round", "route", "royal", "rubber", "rude", "rug", "rule", "run",
      "runway", "rural", "sad", "saddle", "sadness", "safe", "sail", "salad", "salmon", "salon",
      "salt", "salute", "same", "sample", "sand", "satisfy", "satoshi", "sauce", "sausage", "save",
      "say", "scale", "scan", "scare", "scatter", "scene", "scheme", "school", "science", "scissors",
      "scorpion", "scout", "scrap", "screen", "script", "scrub", "sea", "search", "season", "seat",
      "second", "secret", "section", "security", "seed", "seek", "segment", "select", "sell", "seminar",
      "senior", "sense", "sentence", "series", "service", "seven", "shadow", "shaft", "shallow", "share",
      "shed", "shell", "sheriff", "shield", "shift", "shine", "ship", "shiver", "shock", "shoe",
      "shoot", "shop", "shore", "short", "shoulder", "shove", "shrimp", "shrug", "shuffle", "shy",
      "sibling", "sick", "side", "siege", "sight", "sign", "silent", "silk", "silly", "silver",
      "similar", "simple", "since", "sing", "siren", "sister", "situate", "six", "size", "skate",
      "sketch", "ski", "skill", "skin", "skirt", "skull", "slab", "slam", "sleep", "slender",
      "slice", "slide", "slight", "slim", "slogan", "slot", "slow", "slush", "small", "smart",
      "smile", "smoke", "smooth", "snack", "snake", "snap", "sniff", "snow", "soap", "soccer",
      "social", "sock", "soda", "soft", "solar", "soldier", "solid", "solution", "solve", "someone",
      "song", "soon", "sorry", "sort", "soul", "sound", "soup", "source", "south", "space",
      "spare", "spatial", "spawn", "speak", "speed", "spell", "spend", "sphere", "spice", "spider",
      "spike", "spin", "spirit", "split", "spoil", "sponsor", "spoon", "sport", "spot", "spray",
      "spread", "spring", "spy", "square", "squeeze", "squirrel", "stable", "stadium", "staff", "stage",
      "stairs", "stamp", "stand", "start", "state", "stay", "steak", "steel", "stem", "step",
      "stereo", "stick", "still", "sting", "stock", "stomach", "stone", "stool", "story", "stove",
      "strategy", "street", "strike", "strong", "struggle", "student", "stuff", "stumble", "stunt", "style",
      "subject", "submit", "subway", "success", "such", "sudden", "suffer", "sugar", "suggest", "suit",
      "summer", "sun", "sunny", "sunset", "super", "supply", "supreme", "sure", "surface", "surge",
      "surprise", "surround", "survey", "suspect", "sustain", "swallow", "swamp", "swap", "swarm", "swear",
      "sweet", "swift", "swim", "swing", "switch", "sword", "symbol", "symptom", "syrup", "system",
      "table", "tackle", "tag", "tail", "talent", "talk", "tank", "tape", "target", "task",
      "taste", "tattoo", "taxi", "teach", "team", "tell", "ten", "tenant", "tennis", "tent",
      "term", "test", "text", "thank", "that", "theme", "then", "theory", "there", "they",
      "thing", "this", "thought", "three", "thrive", "throw", "thumb", "thunder", "ticket", "tide",
      "tiger", "tilt", "timber", "time", "tiny", "tip", "tired", "tissue", "title", "toast",
      "tobacco", "today", "toddler", "toe", "together", "toilet", "token", "tomato", "tomorrow", "tone",
      "tongue", "tonight", "tool", "tooth", "top", "topic", "topple", "torch", "tornado", "tortoise",
      "toss", "total", "tourist", "toward", "tower", "town", "toy", "track", "trade", "traffic",
      "tragic", "train", "transfer", "trap", "trash", "travel", "tray", "treat", "tree", "trend",
      "trial", "tribe", "trick", "trigger", "trim", "trip", "trophy", "trouble", "truck", "true",
      "truly", "trumpet", "trust", "truth", "try", "tube", "tuition", "tumble", "tuna", "tunnel",
      "turkey", "turn", "turtle", "twelve", "twenty", "twice", "twin", "twist", "two", "type",
      "typical", "ugly", "umbrella", "unable", "unaware", "uncle", "uncover", "under", "undo", "unfair",
      "unfold", "unhappy", "uniform", "unique", "unit", "universe", "unknown", "unlock", "until", "unusual",
      "unveil", "update", "upgrade", "uphold", "upon", "upper", "upright", "uprising", "uproar", "upset",
      "upstairs", "upward", "urban", "urge", "usage", "use", "used", "useful", "useless", "usual",
      "utility", "vacant", "vacuum", "vague", "valid", "valley", "valve", "van", "vanish", "vapor",
      "various", "vast", "vault", "vehicle", "velvet", "vendor", "venue", "verb", "verify", "version",
      "very", "vessel", "veteran", "viable", "vibrant", "vicious", "victory", "video", "view", "village",
      "vintage", "violin", "virtual", "virus", "visa", "visit", "visual", "vital", "vivid", "vocal",
      "voice", "void", "volcano", "volume", "vote", "voucher", "vow", "vowel", "voyage", "wage",
      "wagon", "wait", "walk", "wall", "walnut", "want", "warfare", "warm", "warrior", "wash",
      "wasp", "waste", "water", "wave", "way", "wealth", "weapon", "wear", "weasel", "weather",
      "web", "wedding", "weekend", "weird", "welcome", "west", "wet", "whale", "what", "whatever",
      "wheat", "wheel", "when", "whenever", "where", "whereas", "wherever", "whether", "which", "whiff",
      "while", "whilst", "whisper", "wide", "width", "wife", "wild", "will", "willing", "win",
      "window", "wine", "wing", "wink", "winner", "winter", "wire", "wisdom", "wise", "wish",
      "witness", "wolf", "woman", "wonder", "wood", "wool", "word", "work", "world", "worry",
      "worth", "would", "wound", "wrangle", "wrap", "wreath", "wreck", "wrestle", "wrist", "write",
      "wrong", "yard", "year", "yellow", "you", "young", "youth", "zebra", "zero", "zone",
      "zoo"
    ];
    
    // 12단어 니모닉 생성
    const mnemonic = [];
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      mnemonic.push(words[randomIndex]);
    }
    
    return mnemonic.join(' ');
  }

  /**
   * 니모닉으로 지갑 복구
   * @param {string} mnemonic - 니모닉 구문
   * @returns {Promise<Result>}
   */
  async importFromMnemonic(mnemonic) {
    try {
      // 간단한 니모닉 검증 (브라우저 호환성)
      const words = mnemonic.trim().split(/\s+/);
      if (words.length !== 12 && words.length !== 24) {
        return Result.failure("니모닉은 12개 또는 24개의 단어여야 합니다");
      }

      // 니모닉으로부터 키페어 복구 (간단한 방식)
      const seed = this.mnemonicToSeed(mnemonic);
      const keypair = solanaWeb3.Keypair.fromSeed(seed.slice(0, 32));

      // secretKey를 암호화하여 저장
      const secretKey = Array.from(keypair.secretKey);
      const keystore = await window.anamUI.createKeystore(secretKey);

      return Result.success({
        address: keypair.publicKey.toString(),
        secretKey: keystore,
        mnemonic: mnemonic,
        publicKey: keypair.publicKey.toString(),
      });
    } catch (error) {
      console.error("니모닉 복구 실패:", error);
      return Result.failure(error.message);
    }
  }

  /**
   * 니모닉을 시드로 변환 (일관된 방식)
   * @param {string} mnemonic - 니모닉 구문
   * @returns {Uint8Array}
   */
  mnemonicToSeed(mnemonic) {
    // 간단하고 일관된 방식으로 시드 생성
    const words = mnemonic.trim().split(/\s+/);
    let seed = new Uint8Array(64);
    
    // 각 단어의 인덱스를 찾아서 시드에 저장
    const wordList = [
      "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
      "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
      "action", "actor", "actual", "adapt", "add", "addict", "address", "adjust", "admit", "adult",
      "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent", "agree",
      "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert", "alien",
      "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter", "always",
      "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger", "angle",
      "angry", "animal", "ankle", "announce", "annual", "another", "answer", "antenna", "antique", "anxiety",
      "any", "apart", "apology", "appear", "apple", "approve", "april", "arch", "arctic", "area",
      "arena", "argue", "arm", "armed", "armor", "army", "around", "arrange", "arrest", "arrive",
      "arrow", "art", "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset", "assist",
      "assume", "asthma", "athlete", "atom", "attack", "attend", "attitude", "attract", "auction", "audit",
      "august", "aunt", "author", "auto", "autumn", "average", "avocado", "avoid", "awake", "aware",
      "away", "awesome", "awful", "awkward", "axis", "baby", "bachelor", "bacon", "badge", "bag",
      "balance", "balcony", "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain", "barrel",
      "base", "basic", "basket", "battle", "beach", "bean", "beauty", "because", "become", "beef",
      "before", "begin", "behave", "behind", "believe", "below", "belt", "bench", "benefit", "best",
      "betray", "better", "between", "beyond", "bicycle", "bid", "bike", "bind", "biology", "bird",
      "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleak", "bless", "blind",
      "blood", "blossom", "blouse", "blue", "blur", "blush", "board", "boat", "body", "boil",
      "bomb", "bone", "bonus", "book", "boost", "border", "boring", "borrow", "boss", "bottom",
      "bounce", "box", "boy", "bracket", "brain", "brand", "brass", "brave", "bread", "breeze",
      "brick", "bridge", "brief", "bright", "bring", "brisk", "broccoli", "broken", "bronze", "broom",
      "brother", "brown", "brush", "bubble", "buddy", "budget", "buffalo", "build", "bulb", "bulk",
      "bullet", "bundle", "bunker", "burden", "burger", "burst", "bus", "business", "busy", "butter",
      "buyer", "buzz", "cabbage", "cabin", "cable", "cactus", "cage", "cake", "call", "calm",
      "camera", "camp", "can", "canal", "cancel", "candy", "cannon", "canoe", "canvas", "canyon",
      "capable", "capital", "captain", "car", "carbon", "card", "cargo", "carpet", "carry", "cart",
      "case", "cash", "casino", "castle", "casual", "cat", "catalog", "catch", "category", "cause",
      "caution", "cave", "ceiling", "celery", "cement", "census", "century", "cereal", "certain", "chair",
      "chalk", "champion", "change", "chaos", "chapter", "charge", "chase", "chat", "cheap", "check",
      "cheese", "chef", "cherry", "chest", "chicken", "chief", "child", "chimney", "choice", "choose",
      "chronic", "chuckle", "chunk", "churn", "cigar", "cinnamon", "circle", "citizen", "city", "civil",
      "claim", "clap", "clarify", "claw", "clay", "clean", "clerk", "clever", "click", "client",
      "cliff", "climb", "clinic", "clip", "clock", "clog", "close", "cloth", "cloud", "clown",
      "club", "clump", "cluster", "clutch", "coach", "coast", "coconut", "code", "coffee", "coil",
      "coin", "collect", "color", "column", "combine", "come", "comfort", "comic", "common", "company",
      "concert", "conduct", "confirm", "congress", "connect", "consider", "control", "convince", "cook", "cool",
      "copper", "copy", "coral", "core", "corn", "correct", "cost", "cotton", "couch", "country",
      "couple", "course", "cousin", "cover", "coyote", "crack", "cradle", "craft", "cram", "crane",
      "crash", "crater", "crawl", "crazy", "cream", "credit", "creek", "crew", "cricket", "crime",
      "crisp", "critic", "crop", "cross", "crouch", "crowd", "crucial", "cruel", "cruise", "crumble",
      "crunch", "crush", "cry", "crystal", "cube", "culture", "cup", "cupboard", "curious", "curly",
      "curry", "curtain", "curve", "cushion", "custom", "cute", "cycle", "dad", "damage", "dance",
      "danger", "daring", "dash", "daughter", "dawn", "day", "deal", "debate", "debris", "decade",
      "december", "decide", "decline", "decorate", "decrease", "deer", "defense", "define", "defy", "degree",
      "delay", "deliver", "demand", "demise", "denial", "dentist", "deny", "depart", "depend", "deposit",
      "depth", "deputy", "derive", "describe", "desert", "design", "desk", "despair", "destroy", "detail",
      "detect", "develop", "device", "devote", "diagram", "dial", "diamond", "diary", "dice", "diesel",
      "diet", "differ", "digital", "dignity", "dilemma", "dinner", "dinosaur", "direct", "dirt", "disagree",
      "discover", "disease", "dish", "dismiss", "disorder", "display", "distance", "divert", "divide", "divorce",
      "dizzy", "doctor", "document", "dog", "doll", "dolphin", "domain", "donate", "donkey", "donor",
      "door", "dose", "double", "dove", "draft", "dragon", "drama", "drastic", "draw", "dream",
      "dress", "drift", "drill", "drink", "drip", "drive", "drop", "drum", "dry", "duck",
      "dumb", "dune", "during", "dust", "dutch", "duty", "dwarf", "dynamic", "eager", "eagle",
      "early", "earn", "earth", "easily", "east", "easy", "echo", "ecology", "economy", "edge",
      "edit", "educate", "effort", "egg", "eight", "either", "elbow", "elder", "electric", "elegant",
      "element", "elephant", "elevator", "elite", "else", "embark", "embody", "embrace", "emerge", "emotion",
      "employ", "empower", "empty", "enable", "enact", "end", "endless", "endorse", "enemy", "energy",
      "enforce", "engage", "engine", "enhance", "enjoy", "enlist", "enough", "enrich", "enroll", "ensure",
      "enter", "entire", "entry", "envelope", "episode", "equal", "equip", "era", "erase", "erode",
      "erosion", "error", "erupt", "escape", "essay", "essence", "estate", "eternal", "ethics", "evidence",
      "evil", "evoke", "evolve", "exact", "example", "excess", "exchange", "excite", "exclude", "excuse",
      "execute", "exercise", "exhaust", "exhibit", "exile", "exist", "exit", "exotic", "expand", "expect",
      "expire", "explain", "expose", "express", "extend", "extra", "eye", "eyebrow", "fabric", "face",
      "faculty", "fade", "faint", "faith", "fall", "false", "fame", "family", "famous", "fan",
      "fancy", "fantasy", "farm", "fashion", "fat", "fatal", "father", "fatigue", "fault", "favorite",
      "feature", "february", "federal", "fee", "feed", "feel", "female", "fence", "festival", "fetch",
      "fever", "few", "fiber", "fiction", "field", "figure", "file", "film", "filter", "final",
      "find", "fine", "finger", "finish", "fire", "firm", "first", "fiscal", "fish", "fit",
      "five", "fix", "flag", "flame", "flavor", "flee", "flight", "flip", "float", "flock",
      "floor", "flower", "fluid", "flush", "fly", "foam", "focus", "fog", "foil", "fold",
      "follow", "food", "foot", "force", "forest", "forget", "fork", "fortune", "forum", "forward",
      "fossil", "foster", "found", "fox", "fragile", "frame", "frequent", "fresh", "friend", "fringe",
      "frog", "front", "frost", "frown", "frozen", "fruit", "fuel", "fun", "funny", "furnace",
      "fury", "future", "gadget", "gain", "galaxy", "gallery", "game", "gap", "garage", "garbage",
      "garden", "garlic", "garment", "gas", "gasp", "gate", "gather", "gauge", "gaze", "general",
      "genius", "genre", "gentle", "genuine", "gesture", "ghost", "giant", "gift", "giggle", "ginger",
      "giraffe", "girl", "give", "glad", "glance", "glare", "glass", "gleam", "glee", "glide",
      "glimpse", "glint", "glisten", "glitter", "globe", "gloom", "glory", "glove", "glow", "glue",
      "goat", "goddess", "gold", "good", "goose", "gorilla", "gospel", "gossip", "govern", "gown",
      "grab", "grace", "grain", "grant", "grape", "grass", "gravity", "great", "green", "grid",
      "grief", "grit", "grocery", "group", "grow", "grunt", "guard", "guess", "guide", "guilt",
      "guitar", "gun", "gym", "habit", "hair", "half", "hammer", "hamster", "hand", "happy",
      "harbor", "hard", "harsh", "harvest", "hat", "have", "hawk", "hazard", "head", "health",
      "heart", "heavy", "hedgehog", "height", "hello", "helmet", "help", "hen", "hero", "hidden",
      "high", "hill", "hint", "hip", "hire", "history", "hobby", "hockey", "hold", "hole",
      "holiday", "hollow", "home", "honey", "hood", "hope", "horn", "horror", "horse", "hospital",
      "host", "hotel", "hour", "hover", "hub", "huge", "human", "humble", "humor", "hundred",
      "hungry", "hunt", "hurdle", "hurry", "hurt", "husband", "hybrid", "ice", "icon", "idea",
      "identify", "idle", "ignore", "ill", "illegal", "illness", "image", "imitate", "immense", "immune",
      "impact", "impose", "improve", "impulse", "inch", "include", "income", "increase", "index", "indicate",
      "indoor", "industry", "infant", "inflict", "inform", "inhale", "inherit", "initial", "inject", "injury",
      "inmate", "inner", "innocent", "input", "inquiry", "insane", "insect", "inside", "inspire", "install",
      "intact", "interest", "into", "invest", "invite", "involve", "iron", "island", "isolate", "issue",
      "item", "ivory", "jacket", "jaguar", "jar", "jazz", "jealous", "jeans", "jelly", "jewel",
      "job", "join", "joke", "journey", "joy", "judge", "juice", "juicy", "july", "jumbo",
      "jump", "june", "jungle", "junior", "junk", "just", "kangaroo", "keen", "keep", "ketchup",
      "key", "kick", "kid", "kidney", "kind", "kingdom", "kiss", "kit", "kitchen", "kite",
      "kitten", "kiwi", "knee", "knife", "knock", "know", "lab", "label", "labor", "ladder",
      "lady", "lake", "lamp", "language", "laptop", "large", "later", "latin", "laugh", "laundry",
      "lava", "law", "lawn", "lawsuit", "layer", "lazy", "leader", "leaf", "learn", "leave",
      "lecture", "left", "leg", "legal", "legend", "leisure", "lemon", "lend", "length", "lens",
      "leopard", "lesson", "letter", "level", "liar", "liberty", "library", "license", "life", "lift",
      "light", "like", "limb", "limit", "link", "lion", "liquid", "list", "little", "live",
      "lizard", "load", "loan", "lobster", "local", "lock", "logic", "lonely", "long", "loop",
      "lottery", "loud", "lounge", "love", "loyal", "lucky", "luggage", "lumber", "lunar", "lunch",
      "luxury", "lyrics", "machine", "mad", "magic", "magnet", "maid", "mail", "main", "major",
      "make", "mammal", "man", "manage", "mandate", "mango", "mansion", "manual", "maple", "marble", "march",
      "margin", "marine", "market", "marriage", "mask", "mass", "master", "match", "material", "math",
      "matrix", "matter", "maximum", "maze", "meadow", "mean", "measure", "meat", "mechanic", "medal",
      "media", "melody", "melt", "member", "memory", "mention", "menu", "mercy", "merge", "merit",
      "merry", "mesh", "message", "metal", "method", "middle", "midnight", "milk", "million", "mimic",
      "mind", "minimum", "minor", "minute", "miracle", "mirror", "misery", "miss", "mistake", "mix",
      "mixed", "mixture", "mobile", "model", "modify", "mom", "moment", "monitor", "monkey", "monster",
      "month", "moon", "moral", "more", "morning", "mosquito", "mother", "motion", "motor", "mountain",
      "mouse", "move", "movie", "much", "muffin", "mule", "multiply", "muscle", "museum", "mushroom",
      "music", "must", "mutual", "myself", "mystery", "myth", "naive", "name", "napkin", "narrow",
      "nasty", "nation", "nature", "near", "neck", "need", "negative", "neglect", "neither", "nephew",
      "nerve", "nest", "net", "network", "neutral", "never", "news", "next", "nice", "night",
      "noble", "noise", "nominee", "noodle", "normal", "north", "nose", "notable", "note", "nothing",
      "notice", "novel", "now", "nuclear", "number", "nurse", "nut", "oak", "obey", "object",
      "oblige", "obscure", "observe", "obtain", "obvious", "occur", "ocean", "october", "odor", "off",
      "offer", "office", "often", "oil", "okay", "old", "olive", "olympic", "omit", "once",
      "one", "onion", "online", "only", "open", "opera", "opinion", "oppose", "option", "orange",
      "orbit", "orchard", "order", "ordinary", "organ", "orient", "original", "orphan", "ostrich", "other",
      "outdoor", "outer", "output", "outside", "oval", "oven", "over", "own", "owner", "oxygen",
      "oyster", "ozone", "pact", "paddle", "page", "pair", "palace", "palm", "panda", "panel",
      "panic", "panther", "paper", "parade", "parent", "park", "parrot", "party", "pass", "patch",
      "path", "patient", "patrol", "pattern", "pause", "pave", "payment", "peace", "peach", "peanut",
      "pear", "peasant", "pelican", "pen", "penalty", "pencil", "people", "pepper", "perfect", "permit",
      "person", "pet", "phone", "photo", "phrase", "physical", "picture", "piece", "pig", "pigeon",
      "pill", "pilot", "pink", "pioneer", "pipe", "pistol", "pitch", "pizza", "place", "planet",
      "plastic", "plate", "play", "please", "pledge", "pluck", "plug", "plunge", "poem", "poet",
      "point", "polar", "pole", "police", "pond", "pony", "pool", "poor", "pop", "popular",
      "portion", "position", "possible", "post", "potato", "pottery", "poverty", "powder", "power", "practice",
      "praise", "predict", "prefer", "prepare", "present", "pretty", "prevent", "price", "pride", "primary",
      "print", "priority", "prison", "private", "prize", "problem", "process", "produce", "profit", "program",
      "project", "promote", "proof", "property", "prosper", "protect", "proud", "provide", "public", "pudding",
      "pull", "pulp", "pulse", "pumpkin", "punch", "pupil", "puppy", "purchase", "purity", "purpose",
      "purse", "push", "put", "puzzle", "pyramid", "quality", "quantum", "quarter", "question", "quick",
      "quit", "quiz", "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio", "rail",
      "rain", "raise", "rally", "ramp", "ranch", "random", "range", "rapid", "rare", "rate",
      "rather", "raven", "raw", "razor", "ready", "real", "reason", "rebel", "rebuild", "recall",
      "receive", "recipe", "record", "recycle", "reduce", "reflect", "reform", "refuse", "region", "register",
      "regret", "regular", "reject", "relax", "release", "relief", "rely", "remain", "remember", "remind",
      "remove", "render", "renew", "rent", "reopen", "repair", "repeat", "replace", "report", "require",
      "rescue", "resemble", "resist", "resource", "response", "result", "retire", "retreat", "return", "reunion",
      "reveal", "review", "reward", "rhythm", "rib", "ribbon", "rice", "rich", "ride", "ridge",
      "rifle", "right", "rigid", "ring", "riot", "ripple", "risk", "ritual", "rival", "river",
      "road", "roast", "robot", "robust", "rocket", "romance", "roof", "rookie", "room", "rose",
      "rotate", "rough", "round", "route", "royal", "rubber", "rude", "rug", "rule", "run",
      "runway", "rural", "sad", "saddle", "sadness", "safe", "sail", "salad", "salmon", "salon",
      "salt", "salute", "same", "sample", "sand", "satisfy", "satoshi", "sauce", "sausage", "save",
      "say", "scale", "scan", "scare", "scatter", "scene", "scheme", "school", "science", "scissors",
      "scorpion", "scout", "scrap", "screen", "script", "scrub", "sea", "search", "season", "seat",
      "second", "secret", "section", "security", "seed", "seek", "segment", "select", "sell", "seminar",
      "senior", "sense", "sentence", "series", "service", "session", "settle", "setup", "seven", "shadow",
      "shaft", "shallow", "share", "shed", "shell", "sheriff", "shield", "shift", "shine", "ship",
      "shiver", "shock", "shoe", "shoot", "shop", "shore", "short", "shoulder", "shove", "shrimp",
      "shrug", "shuffle", "shy", "sibling", "sick", "side", "siege", "sight", "sign", "silent",
      "silk", "silly", "silver", "similar", "simple", "since", "sing", "siren", "sister", "situate",
      "six", "size", "skate", "sketch", "ski", "skill", "skin", "skirt", "skull", "slab",
      "slack", "slain", "slang", "slate", "slave", "slender", "slice", "slide", "slight", "slim",
      "slogan", "slot", "slow", "slush", "small", "smart", "smile", "smoke", "smooth", "snack",
      "snake", "snap", "sniff", "snow", "soap", "soccer", "social", "sock", "soda", "soft",
      "solar", "soldier", "solid", "solution", "solve", "someone", "song", "soon", "sorry", "sort",
      "soul", "sound", "soup", "source", "south", "space", "spare", "spatial", "spawn", "speak",
      "speed", "spell", "spend", "sphere", "spice", "spider", "spike", "spin", "spirit", "split",
      "spoil", "sponsor", "spoon", "sport", "spot", "spray", "spread", "spring", "spy", "square",
      "squeeze", "squirrel", "stable", "stadium", "staff", "stage", "stairs", "stamp", "stand", "start",
      "state", "stay", "steak", "steel", "stem", "step", "stereo", "stick", "still", "sting",
      "stomach", "stone", "stool", "story", "stove", "strategy", "street", "strike", "strong", "struggle",
      "student", "stuff", "stumble", "stunned", "subject", "submit", "subway", "success", "such", "sudden",
      "suffer", "sugar", "suggest", "suit", "summer", "sun", "sunny", "sunset", "super", "supply",
      "supreme", "sure", "surface", "surge", "surprise", "surround", "survey", "suspect", "sustain", "swallow",
      "swamp", "swap", "swarm", "swear", "sweet", "swift", "swim", "swing", "swipe", "switch",
      "sword", "symbol", "symptom", "syrup", "system", "table", "tackle", "tag", "tail", "talent",
      "talk", "tank", "tape", "target", "task", "taste", "tattoo", "taxi", "tell", "ten",
      "tenant", "tennis", "tent", "term", "test", "text", "thank", "that", "theme", "then",
      "theory", "there", "they", "thing", "this", "thought", "three", "thrive", "throw", "thumb",
      "thunder", "ticket", "tide", "tidy", "tie", "tiger", "tilt", "timber", "time", "tiny",
      "tip", "tired", "tissue", "title", "toast", "tobacco", "today", "toddler", "toe", "together",
      "toilet", "token", "tomato", "tomorrow", "tone", "tongue", "tonight", "tool", "tooth", "top",
      "topic", "topple", "torch", "tornado", "tortoise", "toss", "total", "tourist", "toward", "tower",
      "town", "toy", "track", "trade", "traffic", "tragic", "train", "transfer", "trap", "trash",
      "travel", "tray", "treat", "tree", "trend", "trial", "tribe", "trick", "trigger", "trim",
      "trip", "trophy", "trouble", "truck", "true", "truly", "trumpet", "trust", "truth", "try",
      "tube", "tuition", "tumble", "tuna", "tunnel", "turkey", "turn", "turtle", "twelve", "twenty",
      "twice", "twin", "twist", "two", "type", "typical", "ugly", "umbrella", "unable", "unaware",
      "uncle", "uncover", "under", "undo", "unfair", "unfold", "unhappy", "uniform", "unique", "unit",
      "universe", "unknown", "unlock", "until", "unusual", "unveil", "update", "upgrade", "uphold", "upon",
      "upper", "upright", "uprising", "uproar", "upset", "upstairs", "upward", "urban", "urge", "usage",
      "use", "used", "useful", "useless", "usual", "utility", "vacant", "vacuum", "vague", "valid",
      "valley", "valve", "van", "vanish", "vapor", "various", "vast", "vault", "vehicle", "velvet",
      "vendor", "venue", "verb", "verify", "version", "very", "vessel", "veteran", "viable", "vibrant",
      "vicious", "victory", "video", "view", "village", "vintage", "violin", "virtual", "virus", "visa",
      "visit", "visual", "vital", "vivid", "vocal", "voice", "void", "volcano", "volume", "vote",
      "voucher", "vow", "vowel", "voyage", "wage", "wagon", "wait", "walk", "wall", "walnut",
      "want", "warfare", "warm", "warrior", "wash", "wasp", "waste", "water", "wave", "way",
      "wealth", "weapon", "wear", "weasel", "weather", "web", "wedding", "weekend", "weird", "welcome",
      "west", "wet", "whale", "what", "whatever", "wheat", "wheel", "when", "whenever", "where",
      "whereas", "wherever", "whether", "which", "whiff", "while", "whilst", "whisper", "wide", "width",
      "wife", "wild", "will", "willing", "win", "window", "wine", "wing", "wink", "winner",
      "winter", "wire", "wisdom", "wise", "wish", "witness", "wolf", "woman", "wonder", "wood",
      "wool", "word", "work", "world", "worry", "worth", "would", "wound", "wrangle", "wrap",
      "wreath", "wreck", "wrestle", "wrist", "write", "wrong", "yard", "year", "yellow", "you",
      "young", "youth", "zebra", "zero", "zone", "zoo"
    ];
    
    // 각 단어의 인덱스를 찾아서 시드에 저장
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const index = wordList.indexOf(word);
      
      if (index === -1) {
        throw new Error(`알 수 없는 단어: ${word}`);
      }
      
      // 인덱스를 4바이트씩 시드에 저장
      seed[i * 4] = (index & 0xff);
      seed[i * 4 + 1] = ((index >> 8) & 0xff);
      seed[i * 4 + 2] = ((index >> 16) & 0xff);
      seed[i * 4 + 3] = ((index >> 24) & 0xff);
    }
    
    return seed;
  }

  /**
   * 개인키로 지갑 가져오기
   * @param {string} privateKey - 개인키
   * @returns {Promise<Result>}
   */
  async importFromPrivateKey(privateKey) {
    try {
      // Hex string을 Uint8Array로 변환
      const secretKey = Uint8Array.from(
        privateKey.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
      );

      const keypair = solanaWeb3.Keypair.fromSecretKey(secretKey);

      // secretKey를 암호화하여 저장
      const keystore = await window.anamUI.createKeystore(Array.from(secretKey));

      return Result.success({
        address: keypair.publicKey.toString(),
        secretKey: keystore,
        publicKey: keypair.publicKey.toString(),
      });
    } catch (error) {
      console.error("개인키 가져오기 실패:", error);
      return Result.failure("유효하지 않은 개인키입니다");
    }
  }

  /**
   * 주소 유효성 검사
   * @param {string} address - 검증할 주소
   * @returns {boolean}
   */
  isValidAddress(address) {
    try {
      new solanaWeb3.PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 잔액 조회 (lamports → SOL 변환)
   * @param {string} address - 조회할 주소
   * @returns {Promise<Result>} - SOL 단위 잔액
   */
  async getBalance(address) {
    try {
      await this.initProvider();
      const publicKey = new solanaWeb3.PublicKey(address);
      const balance = await this.connection.getBalance(publicKey);
      
      // lamports를 SOL로 변환
      const solBalance = balance / solanaWeb3.LAMPORTS_PER_SOL;
      
      return Result.success(solBalance.toString());
    } catch (error) {
      console.error("잔액 조회 실패:", error);
      return Result.failure("잔액 조회에 실패했습니다");
    }
  }

  /**
   * 트랜잭션 전송
   * @param {string} to - 받는 주소
   * @param {string} lamports - 전송할 lamports
   * @returns {Promise<Result>}
   */
  async sendTx(to, lamports) {
    try {
      if (!this.isValidAddress(to)) {
        return Result.failure("유효하지 않은 주소입니다");
      }

      await this.initProvider();

      // 저장된 secretKey 복원
      const walletData = JSON.parse(localStorage.getItem("walletData"));
      if (!walletData || !walletData.secretKey) {
        return Result.failure("지갑이 초기화되지 않았습니다");
      }

      const secretKey = await window.anamUI.decryptKeystore(walletData.secretKey);
      const fromKeypair = solanaWeb3.Keypair.fromSecretKey(new Uint8Array(secretKey));

      // 트랜잭션 생성
      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: new solanaWeb3.PublicKey(to),
          lamports: parseInt(lamports),
        })
      );

      // 최근 블록해시 가져오기
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromKeypair.publicKey;

      // 트랜잭션 서명
      transaction.sign(fromKeypair);

      // 트랜잭션 전송
      const signature = await this.connection.sendRawTransaction(
        transaction.serialize()
      );

      // 트랜잭션 확인 대기
      const confirmation = await this.connection.confirmTransaction(signature);

      if (confirmation.value.err) {
        return Result.failure("트랜잭션 전송에 실패했습니다");
      }

      return Result.success({
        hash: signature,
        signature: signature,
      });
    } catch (error) {
      console.error("트랜잭션 전송 실패:", error);
      return Result.failure(error.message || "트랜잭션 전송에 실패했습니다");
    }
  }

  /**
   * 트랜잭션 히스토리 조회
   * @param {string} address - 조회할 주소
   * @returns {Promise<Result>}
   */
  async getHistory(address) {
    try {
      await this.initProvider();
      const publicKey = new solanaWeb3.PublicKey(address);

      // 최근 10건의 트랜잭션 서명 가져오기
      const signatures = await this.connection.getConfirmedSignaturesForAddress2(
        publicKey,
        { limit: 10 }
      );

      // 트랜잭션 상세 정보 가져오기
      const transactions = await Promise.all(
        signatures.map(async (sig) => {
          try {
            const tx = await this.connection.getTransaction(sig.signature, {
              commitment: "confirmed",
            });
            
            return {
              signature: sig.signature,
              slot: sig.slot,
              blockTime: sig.blockTime,
              status: tx?.meta?.err ? "실패" : "성공",
              amount: tx?.meta?.postBalances?.[0] || 0,
            };
          } catch (error) {
            return {
              signature: sig.signature,
              slot: sig.slot,
              blockTime: sig.blockTime,
              status: "알 수 없음",
              amount: 0,
            };
          }
        })
      );

      return Result.success(transactions);
    } catch (error) {
      console.error("트랜잭션 히스토리 조회 실패:", error);
      return Result.failure("트랜잭션 히스토리 조회에 실패했습니다");
    }
  }

  /**
   * 트랜잭션 상태 조회
   * @param {string} txHash - 트랜잭션 해시
   * @returns {Promise<Result>}
   */
  async getTransactionStatus(txHash) {
    try {
      await this.initProvider();
      const tx = await this.connection.getTransaction(txHash, {
        commitment: "confirmed",
      });

      if (!tx) {
        return Result.failure("트랜잭션을 찾을 수 없습니다");
      }

      return Result.success({
        status: tx.meta?.err ? "실패" : "성공",
        confirmations: tx.meta?.confirmations || 0,
        blockTime: tx.blockTime,
      });
    } catch (error) {
      console.error("트랜잭션 상태 조회 실패:", error);
      return Result.failure("트랜잭션 상태 조회에 실패했습니다");
    }
  }

  /**
   * 현재 네트워크 수수료 조회
   * @returns {Promise<Result>}
   */
  async getGasPrice() {
    try {
      await this.initProvider();
      const fees = await this.connection.getRecentPrioritizationFees([
        solanaWeb3.SystemProgram.programId,
      ]);

      const fee = fees[0]?.prioritizationFee || 5000; // 기본값 5000 lamports

      return Result.success({
        low: (fee * 0.8).toString(),
        medium: fee.toString(),
        high: (fee * 1.2).toString(),
      });
    } catch (error) {
      console.error("수수료 조회 실패:", error);
      return Result.failure("수수료 조회에 실패했습니다");
    }
  }

  /**
   * 트랜잭션 수수료 예상
   * @param {Object} txParams - 트랜잭션 파라미터
   * @returns {Promise<Result>}
   */
  async estimateFee(txParams) {
    try {
      await this.initProvider();
      
      // 기본 수수료 (약 5000 lamports)
      const baseFee = 5000;
      
      return Result.success(baseFee.toString());
    } catch (error) {
      console.error("수수료 예상 실패:", error);
      return Result.failure("수수료 예상에 실패했습니다");
    }
  }
}

// ================================================================
// 미니앱 생명주기 정의
// ================================================================

// 전역 앱 상태 관리
const AppState = {
  isInitialized: false,
  walletData: null,
  config: CoinConfig,
  adapter: null,
};

// 미니앱 생명주기 핸들러
window.App = {
  // 앱 시작 시 호출 (최초 1회)
  onLaunch(options) {
    console.log("Solana 지갑 앱 시작:", options);

    this.initializeApp();
    this.loadWalletData();
    this.startNetworkMonitoring();
  },

  // 앱이 포그라운드로 전환될 때
  onShow(options) {
    console.log("Solana 지갑 앱 활성화:", options);

    if (AppState.walletData?.address) {
      this.refreshBalance();
    }

    this.checkNetworkStatus();
  },

  // 앱이 백그라운드로 전환될 때
  onHide() {
    console.log("Solana 지갑 앱 비활성화");
  },

  // 앱 오류 발생 시
  onError(error) {
    console.error("Solana 지갑 앱 오류:", error);
  },

  // ================================================================
  // 초기화 메서드
  // ================================================================

  initializeApp() {
    if (AppState.isInitialized) return;

    this.validateConfig();
    
    // SolanaAdapter 인스턴스 생성 및 등록
    const solanaAdapter = new SolanaAdapter(CoinConfig);
    window.setAdapter(solanaAdapter);

    AppState.isInitialized = true;
  },

  validateConfig() {
    const required = ["name", "symbol", "network"];
    for (const field of required) {
      if (!CoinConfig[field]) {
        throw new Error(`필수 설정 누락: ${field}`);
      }
    }
  },

  // ================================================================
  // 데이터 관리
  // ================================================================

  loadWalletData() {
    try {
      const stored = localStorage.getItem("walletData");
      if (stored) {
        AppState.walletData = JSON.parse(stored);
      }
    } catch (e) {
      console.error("지갑 데이터 로드 실패:", e);
    }
  },

  saveWalletData(data) {
    try {
      AppState.walletData = data;
      localStorage.setItem("walletData", JSON.stringify(data));
    } catch (e) {
      console.error("지갑 데이터 저장 실패:", e);
    }
  },

  // ================================================================
  // 네트워크 관리
  // ================================================================

  startNetworkMonitoring() {
    console.log("네트워크 모니터링 시작");
  },

  checkNetworkStatus() {
    return true;
  },

  // ================================================================
  // 비즈니스 로직
  // ================================================================

  async refreshBalance() {
    if (!AppState.adapter || !AppState.walletData?.address) return;

    try {
      const result = await AppState.adapter.getBalance(
        AppState.walletData.address
      );
      
      if (result.success) {
        console.log("잔액 업데이트:", result.data);
      } else {
        console.error("잔액 조회 실패:", result.error);
      }
    } catch (e) {
      console.error("잔액 새로고침 실패:", e);
    }
  },
};

// ================================================================
// 전역 유틸리티 함수
// ================================================================

// 설정 접근자
window.getConfig = () => AppState.config;

// 어댑터 접근자
window.getAdapter = () => AppState.adapter;

// 어댑터 설정 (각 코인 구현체에서 호출)
window.setAdapter = (adapter) => {
  if (!(adapter instanceof CoinAdapter)) {
    throw new Error("유효하지 않은 CoinAdapter 인스턴스입니다.");
  }
  AppState.adapter = adapter;
};

// ================================================================
// 공통 유틸리티 함수
// ================================================================

// Toast 메시지 표시
window.showToast = (message, type = "info") => {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// 잔액을 사람이 읽기 쉬운 형식으로 변환
window.formatBalance = (balance, decimals = 9) => {
  const value = Number(balance);
  return value.toFixed(4);
};

// 금액을 lamports로 변환
window.parseAmount = (amount) => {
  const value = parseFloat(amount) * solanaWeb3.LAMPORTS_PER_SOL;
  return value.toString();
};

// 주소 축약 표시
window.shortenAddress = (address, chars = 4) => {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
};

// ================================================================
// 앱 초기화
// ================================================================

// 앱 시작 시 호출
if (window.App && window.App.onLaunch) {
  window.App.onLaunch({});
}
