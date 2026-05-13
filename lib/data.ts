// ═══════════════════════════════════════════════════════════════════════════
// DISCOVERY SUITE — All test data and scoring logic
// All theme names, descriptions, question pairs are fully original.
// IPIP-50 items are public domain (Lewis Goldberg, IPIP).
// ═══════════════════════════════════════════════════════════════════════════

// ─── TYPES ──────────────────────────────────────────────────────────────────

export type TestId = 'talent' | 'ocean' | 'connect'

export interface TestMeta {
  id: TestId
  name: string
  subtitle: string
  icon: string
  color: string
  colorDim: string
  questionCount: number
  estimatedMinutes: number
  prayer: string
  intro: string
}

export interface TalentScores { [theme: string]: number }
export interface OceanScores { O: number; C: number; E: number; A: number; N: number }
export interface ConnectScores { W: number; Q: number; G: number; S: number; T: number }

export interface AllResults {
  talent?: TalentScores
  ocean?: OceanScores
  connect?: ConnectScores
  completedAt?: { talent?: string; ocean?: string; connect?: string }
}

// ─── TEST META ───────────────────────────────────────────────────────────────

export const TEST_META: Record<TestId, TestMeta> = {
  talent: {
    id: 'talent',
    name: 'Talent Profile',
    subtitle: 'Patterns in your gifts',
    icon: '⚡',
    color: '#C9A84C',
    colorDim: '#C9A84C22',
    questionCount: 34,
    estimatedMinutes: 8,
    prayer: `Lord, before I begin, I surrender my expectations.\nHelp me listen with honesty and humility.\nIf these questions reveal anything true, let it become a starting point — not a verdict.\nIf they reveal anything unhelpful, help me lay it down before You.\nKeep my heart open to Your light, direction, and confirmation.\nAmen.`,
    intro: 'You\'ll see 34 pairs of statements. Choose the one that feels more like your current pattern, not a final label for who you are. There are no right answers — just a place to begin.',
  },
  ocean: {
    id: 'ocean',
    name: 'Personality Profile',
    subtitle: 'Patterns in how you show up',
    icon: '🌊',
    color: '#7C9EF8',
    colorDim: '#7C9EF822',
    questionCount: 50,
    estimatedMinutes: 10,
    prayer: `Father, You know me more deeply than any assessment can.\nAs I answer, help me do so honestly and without fear.\nLet these results point me toward wisdom, not self-contempt or self-congratulation.\nUse what is true to guide me, and let anything that is not from You fall away.\nAmen.`,
    intro: 'You\'ll rate 50 statements on a scale of 1 (Not me) to 5 (Very me). Answer quickly with your first instinct — not to lock in an identity, but to notice a pattern you can bring before God. Based on the validated IPIP-50 model.',
  },
  connect: {
    id: 'connect',
    name: 'Connection Style',
    subtitle: 'Patterns in how you connect',
    icon: '💛',
    color: '#F4845F',
    colorDim: '#F4845F22',
    questionCount: 30,
    estimatedMinutes: 6,
    prayer: `God, teach me to see these patterns with humility.\nIf this assessment helps me notice something useful, let it be an invitation to prayer, not a conclusion.\nIf it touches a place of longing or hurt, meet me there with truth and grace.\nKeep this from becoming an idol, and make it a doorway into deeper trust.\nAmen.`,
    intro: 'You\'ll see 30 pairs of statements. Choose the one that resonates more with your current pattern of giving and receiving care. This is a place to notice, not to label yourself forever.',
  },
}

// ─── TALENT PROFILE ──────────────────────────────────────────────────────────

export interface TalentTheme {
  domain: string
  icon: string
  desc: string
  career: string
}

export const TALENT_DOMAINS: Record<string, { color: string; themes: string[] }> = {
  Doing:       { color: '#C9A84C', themes: ['Drive','Launch','Precision','Ownership','Restoration'] },
  Thinking:    { color: '#7C9EF8', themes: ['Inquiry','Pattern','Archive','Vision','Spark','Depth','Absorption','Growth'] },
  Relating:    { color: '#7CCC8E', themes: ['Resonance','Cultivate','Bond','Bridge','Welcome','Harmony','Lens'] },
  Influencing: { color: '#F4845F', themes: ['Voice','Charge','Excellence','Edge','Confidence','Impact','Magnetic'] },
  Living:      { color: '#C77DFF', themes: ['Conviction','Fairness','Optimism'] },
}

export const TALENT_THEMES: Record<string, TalentTheme> = {
  Drive:       { domain:'Doing',       icon:'🔥', desc:'You have a relentless internal engine. Every day without meaningful work feels wasted. You measure your worth by what you accomplish.',                             career:'High-output roles: ministry leadership, entrepreneurship, marketing execution, operations' },
  Launch:      { domain:'Doing',       icon:'🚀', desc:'The moment a decision is made, you\'re already moving. Waiting feels like waste. You turn ideas into motion faster than anyone.',                              career:'Church planting, startups, campaign management, event coordination' },
  Precision:   { domain:'Doing',       icon:'🎯', desc:'You create systems, schedules, and routines. Order isn\'t a preference — it\'s how you think best.',                                                           career:'Operations, finance, project management, administration' },
  Ownership:   { domain:'Doing',       icon:'🔑', desc:'You take full responsibility for everything you commit to. Breaking a promise to yourself is unacceptable.',                                                    career:'Project leadership, trusted advisor roles, pastoral ministry, consulting' },
  Restoration: { domain:'Doing',       icon:'🔧', desc:'You come alive when something is broken. The worse the situation, the more energized you feel.',                                                               career:'Turnaround leadership, consulting, crisis ministry' },
  Inquiry:     { domain:'Thinking',    icon:'🔬', desc:'You need evidence before you trust. You challenge assumptions and dig for root causes before committing.',                                                      career:'Research, data analysis, theology, strategic consulting' },
  Pattern:     { domain:'Thinking',    icon:'🧩', desc:'You spot connections across unrelated fields. Your mind builds bridges others don\'t see.',                                                                    career:'Strategy, consulting, vision leadership, ministry planning' },
  Archive:     { domain:'Thinking',    icon:'📚', desc:'History guides your decisions. You understand the present by mastering the past.',                                                                             career:'Teaching, journalism, institutional strategy, theology' },
  Vision:      { domain:'Thinking',    icon:'🔭', desc:'The future captivates you. You paint vivid pictures of what could be and pull others toward them.',                                                            career:'Visionary leadership, preaching, innovation roles' },
  Spark:       { domain:'Thinking',    icon:'💡', desc:'You love the rush of a brand-new idea. Connecting unrelated concepts into something original thrills you.',                                                    career:'Creative direction, R&D, content strategy, innovation' },
  Depth:       { domain:'Thinking',    icon:'🌊', desc:'You need quiet, alone time to think. You wrestle with ideas deeply and don\'t rush to conclusions.',                                                           career:'Writing, theology, philosophy, deep research' },
  Absorption:  { domain:'Thinking',    icon:'🗂️', desc:'You collect — information, facts, objects, stories. You\'re a curator of things that might matter someday.',                                                  career:'Research, curation, journalism, content creation' },
  Growth:      { domain:'Thinking',    icon:'📈', desc:'Learning energizes you. It\'s not mastery you\'re after — it\'s the process of becoming more.',                                                               career:'Training, education, consulting, any growth-driven environment' },
  Resonance:   { domain:'Relating',    icon:'🎵', desc:'You sense emotions before they\'re spoken. People feel deeply understood when they\'re with you.',                                                             career:'Counseling, pastoral care, social work, brand storytelling' },
  Cultivate:   { domain:'Relating',    icon:'🌱', desc:'You see potential in people others overlook. Nothing fulfills you more than watching someone step into their calling.',                                         career:'Coaching, youth ministry, mentorship, talent development' },
  Bond:        { domain:'Relating',    icon:'🔗', desc:'You go deep with the people you already know. You prefer one real friendship over ten surface ones.',                                                          career:'Small group ministry, team-based work, mentoring' },
  Bridge:      { domain:'Relating',    icon:'🌉', desc:'You see how all people, ideas, and events are interconnected. Nothing is random. Everything has meaning.',                                                     career:'Community building, chaplaincy, spiritual direction' },
  Welcome:     { domain:'Relating',    icon:'🚪', desc:'No one sits on the sidelines when you\'re around. You instinctively expand the circle.',                                                                       career:'Community organizing, hospitality ministry, education' },
  Harmony:     { domain:'Relating',    icon:'☮️', desc:'You look for consensus and avoid unnecessary friction. When people agree, real progress happens.',                                                             career:'Mediation, team facilitation, HR, collaborative ministry' },
  Lens:        { domain:'Relating',    icon:'🔍', desc:'You see every person as completely unique. You resist treating people as a group — you tailor everything.',                                                    career:'Coaching, HR, talent development, personalized marketing' },
  Voice:       { domain:'Influencing', icon:'🎤', desc:'You turn thoughts into words that captivate. Whether written or spoken, you know how to tell the story.',                                                      career:'Public speaking, preaching, content creation, marketing' },
  Charge:      { domain:'Influencing', icon:'⚡', desc:'You take charge in uncertainty. You break gridlock and your presence commands a room.',                                                                         career:'Executive leadership, public ministry, advocacy, crisis leadership' },
  Excellence:  { domain:'Influencing', icon:'✨', desc:'You take good and make it great. Average is simply not interesting to you.',                                                                                   career:'Executive coaching, quality assurance, brand excellence' },
  Edge:        { domain:'Influencing', icon:'🏆', desc:'You measure yourself against benchmarks and push hard to be the best. Competition energizes you.',                                                             career:'Sales, performance-based roles, media, high-stakes ministry' },
  Confidence:  { domain:'Influencing', icon:'🦁', desc:'You trust your own judgment even when others disagree. You don\'t need validation to act.',                                                                    career:'Entrepreneurship, executive leadership, solo ministry' },
  Impact:      { domain:'Influencing', icon:'🌟', desc:'You want your life to count for something. You want your work recognized and your legacy to last.',                                                            career:'Public-facing ministry, brand building, leadership' },
  Magnetic:    { domain:'Influencing', icon:'🧲', desc:'You win new people over almost effortlessly. Meeting strangers is an adventure, not a task.',                                                                  career:'Evangelism, sales, community outreach, public-facing ministry' },
  Conviction:  { domain:'Living',      icon:'⚓', desc:'You have core values that don\'t bend. Your purpose flows from what you believe, not what\'s convenient.',                                                    career:'Pastoral ministry, non-profit leadership, faith-based brands' },
  Fairness:    { domain:'Living',      icon:'⚖️', desc:'You believe everyone deserves the same standard. You build trust through consistency and impartiality.',                                                       career:'HR, administration, law, policy, institutional ministry' },
  Optimism:    { domain:'Living',      icon:'☀️', desc:'Your energy is contagious. You bring lightness into heavy rooms and find the silver lining instinctively.',                                                    career:'Team leadership, hospitality, children\'s ministry, coaching' },
}

export interface TalentQuestion {
  a: string; tA: string
  b: string; tB: string
}

export const TALENT_Q: TalentQuestion[] = [
  { a:"I have a relentless drive — I feel restless without meaningful work to do.",            tA:"Drive",      b:"When a decision is made, I'm already in motion toward it.",                                tB:"Launch" },
  { a:"I create systems and routines to perform at my best.",                                  tA:"Precision",  b:"I take complete responsibility for everything I commit to.",                                tB:"Ownership" },
  { a:"I feel most alive when I'm fixing something that's broken.",                            tA:"Restoration",b:"I need data and evidence before I trust any conclusion.",                                   tB:"Inquiry" },
  { a:"I see patterns and find paths where others see confusion.",                             tA:"Pattern",    b:"I look to history and precedent to make wise decisions.",                                   tB:"Archive" },
  { a:"I'm energized by imagining what could be — the future captivates me.",                 tA:"Vision",     b:"I love connecting unrelated ideas into something completely new.",                          tB:"Spark" },
  { a:"I need alone time to think deeply and wrestle with big ideas.",                         tA:"Depth",      b:"I collect information and ideas like a curator.",                                          tB:"Absorption" },
  { a:"Learning new things energizes me more than mastering what I already know.",             tA:"Growth",     b:"I feel what others feel — almost before they say it.",                                     tB:"Resonance" },
  { a:"I love helping others grow and watching their potential come alive.",                   tA:"Cultivate",  b:"I go deep in friendships — I prefer a few close ones over many surface ones.",             tB:"Bond" },
  { a:"I see how all people and events are connected — nothing feels random to me.",           tA:"Bridge",     b:"I make sure no one is left out — I instinctively expand the circle.",                     tB:"Welcome" },
  { a:"I work toward consensus and try to keep the peace.",                                   tA:"Harmony",    b:"I see every person as completely unique and tailor my approach.",                           tB:"Lens" },
  { a:"I captivate people with my words — written or spoken.",                                tA:"Voice",      b:"I take charge in uncertainty and break gridlock.",                                          tB:"Charge" },
  { a:"I take what's good and push it until it's excellent.",                                 tA:"Excellence", b:"I measure myself against others and push hard to win.",                                     tB:"Edge" },
  { a:"I trust my own instincts even when others disagree.",                                  tA:"Confidence", b:"I want my work to leave a lasting impact and legacy.",                                      tB:"Impact" },
  { a:"I win new people over naturally — meeting strangers is energizing.",                   tA:"Magnetic",   b:"I have core values I won't compromise, no matter the pressure.",                           tB:"Conviction" },
  { a:"I believe in treating everyone by the same consistent standard.",                      tA:"Fairness",   b:"I bring energy and optimism into every room I enter.",                                      tB:"Optimism" },
  { a:"I push hard every day — my drive never truly rests.",                                  tA:"Drive",      b:"I create systems and structure to work at peak efficiency.",                                tB:"Precision" },
  { a:"I take ownership of my commitments — my word is my bond.",                             tA:"Ownership",  b:"I love diagnosing and fixing problems, the harder the better.",                            tB:"Restoration" },
  { a:"I challenge assumptions and search for root causes.",                                  tA:"Inquiry",    b:"I see paths others miss and build plans out of apparent chaos.",                            tB:"Pattern" },
  { a:"I study history to understand the present.",                                           tA:"Archive",    b:"I paint vivid pictures of a better future.",                                               tB:"Vision" },
  { a:"I love the thrill of a fresh, original idea.",                                         tA:"Spark",      b:"I think best alone, in quiet, with space to go deep.",                                     tB:"Depth" },
  { a:"I collect knowledge and information like a treasure trove.",                           tA:"Absorption", b:"Learning and growing energizes me more than anything.",                                    tB:"Growth" },
  { a:"People feel understood when they're with me — I sense emotions easily.",               tA:"Resonance",  b:"I invest deeply in helping specific people realize their potential.",                       tB:"Cultivate" },
  { a:"I go deep with people I trust rather than spreading myself wide.",                     tA:"Bond",       b:"I see the threads that connect everyone and everything.",                                   tB:"Bridge" },
  { a:"I make sure everyone is included — no one is left on the sidelines.",                  tA:"Welcome",    b:"I work toward peace and agreement in group settings.",                                      tB:"Harmony" },
  { a:"I see each person as unique and resist one-size-fits-all approaches.",                 tA:"Lens",       b:"I know how to tell stories that move and captivate people.",                               tB:"Voice" },
  { a:"I take command when no one else will and move things forward.",                        tA:"Charge",     b:"I'm driven to elevate quality — average doesn't interest me.",                             tB:"Excellence" },
  { a:"I compete to win and measure myself against clear benchmarks.",                        tA:"Edge",       b:"I trust myself to act even without consensus or approval.",                                 tB:"Confidence" },
  { a:"I want my work to matter and be recognized.",                                          tA:"Impact",     b:"I connect with new people effortlessly and love growing my circle.",                        tB:"Magnetic" },
  { a:"My beliefs and values are the foundation of everything I do.",                         tA:"Conviction", b:"I hold everyone to the same fair standard.",                                               tB:"Fairness" },
  { a:"I lift the mood of every space I enter.",                                              tA:"Optimism",   b:"I never stop working until the work is done.",                                             tB:"Drive" },
  { a:"I move immediately once a decision is made.",                                          tA:"Launch",     b:"I create order and systems everywhere I go.",                                               tB:"Precision" },
  { a:"I take full ownership of my word.",                                                    tA:"Ownership",  b:"I diagnose and fix broken things — it's where I thrive.",                                  tB:"Restoration" },
  { a:"I need evidence before I trust.",                                                      tA:"Inquiry",    b:"I see how all things are connected.",                                                       tB:"Bridge" },
  { a:"I see a vivid future others can't yet imagine.",                                       tA:"Vision",     b:"I bring warmth and enthusiasm into every interaction.",                                     tB:"Optimism" },
]

// ─── OCEAN (IPIP-50 — public domain) ─────────────────────────────────────────

export interface OceanItem {
  id: number; t: 'O'|'C'|'E'|'A'|'N'; text: string; r: boolean
}

export const OCEAN_ITEMS: OceanItem[] = [
  { id:1,  t:'O', text:'I have a vivid imagination.',                             r:false },
  { id:2,  t:'O', text:'I am not interested in abstract ideas.',                  r:true  },
  { id:3,  t:'O', text:'I enjoy thinking about philosophical questions.',         r:false },
  { id:4,  t:'O', text:'I avoid complex reading and deep topics.',                r:true  },
  { id:5,  t:'O', text:'I love exploring new and original ideas.',                r:false },
  { id:6,  t:'O', text:'I prefer routine and the familiar over novelty.',         r:true  },
  { id:7,  t:'O', text:'I experience beauty deeply — in art, music, or nature.',  r:false },
  { id:8,  t:'O', text:'I tend to stick with tradition over new approaches.',     r:true  },
  { id:9,  t:'O', text:'I am curious about many different things.',               r:false },
  { id:10, t:'O', text:'I find creative work uninteresting.',                     r:true  },
  { id:11, t:'C', text:'I pay close attention to details.',                       r:false },
  { id:12, t:'C', text:'I often leave my belongings scattered around.',           r:true  },
  { id:13, t:'C', text:'I follow a schedule and stick to it.',                    r:false },
  { id:14, t:'C', text:'I often forget to put things back where they belong.',    r:true  },
  { id:15, t:'C', text:'I get tasks done right away.',                            r:false },
  { id:16, t:'C', text:'I find it difficult to stay focused.',                    r:true  },
  { id:17, t:'C', text:'I carry out my plans consistently.',                      r:false },
  { id:18, t:'C', text:'I often waste time.',                                     r:true  },
  { id:19, t:'C', text:'I am always prepared.',                                   r:false },
  { id:20, t:'C', text:'I avoid doing what I\'m supposed to.',                    r:true  },
  { id:21, t:'E', text:'I am the life of the party.',                             r:false },
  { id:22, t:'E', text:'I don\'t talk a lot.',                                    r:true  },
  { id:23, t:'E', text:'I feel comfortable around people.',                       r:false },
  { id:24, t:'E', text:'I keep in the background.',                               r:true  },
  { id:25, t:'E', text:'I start conversations easily.',                           r:false },
  { id:26, t:'E', text:'I have little to say.',                                   r:true  },
  { id:27, t:'E', text:'I talk to a lot of different people at social events.',   r:false },
  { id:28, t:'E', text:'I don\'t like drawing attention to myself.',              r:true  },
  { id:29, t:'E', text:'I don\'t mind being the center of attention.',            r:false },
  { id:30, t:'E', text:'I am quiet around strangers.',                            r:true  },
  { id:31, t:'A', text:'I feel others\' emotions deeply.',                        r:false },
  { id:32, t:'A', text:'I am not really interested in others.',                   r:true  },
  { id:33, t:'A', text:'I make people feel at ease.',                             r:false },
  { id:34, t:'A', text:'I am not interested in other people\'s problems.',        r:true  },
  { id:35, t:'A', text:'I have a soft heart.',                                    r:false },
  { id:36, t:'A', text:'I don\'t go out of my way for others.',                  r:true  },
  { id:37, t:'A', text:'I take time out for others.',                             r:false },
  { id:38, t:'A', text:'I feel little concern for others.',                       r:true  },
  { id:39, t:'A', text:'I am interested in people.',                              r:false },
  { id:40, t:'A', text:'I am hard to get to know.',                               r:true  },
  { id:41, t:'N', text:'I get stressed out easily.',                              r:false },
  { id:42, t:'N', text:'I am relaxed most of the time.',                          r:true  },
  { id:43, t:'N', text:'I worry about things a lot.',                             r:false },
  { id:44, t:'N', text:'I seldom feel blue.',                                     r:true  },
  { id:45, t:'N', text:'I am easily disturbed.',                                  r:false },
  { id:46, t:'N', text:'I am not easily bothered by things.',                     r:true  },
  { id:47, t:'N', text:'I get upset easily.',                                     r:false },
  { id:48, t:'N', text:'I rarely get irritated.',                                 r:true  },
  { id:49, t:'N', text:'I change my mood a lot.',                                 r:false },
  { id:50, t:'N', text:'I have frequent mood swings.',                            r:false },
]

export const OCEAN_META: Record<string, { name: string; color: string; icon: string }> = {
  O:{ name:'Openness',          color:'#7C9EF8', icon:'🔮' },
  C:{ name:'Conscientiousness', color:'#5BC4BF', icon:'📋' },
  E:{ name:'Extraversion',      color:'#C9A84C', icon:'⚡' },
  A:{ name:'Agreeableness',     color:'#7CCC8E', icon:'🫶' },
  N:{ name:'Neuroticism',       color:'#F4845F', icon:'🌊' },
}

export const OCEAN_INTERP: Record<string, { H: Interp; M: Interp; L: Interp }> = {
  O:{ H:{label:'Highly Open',           desc:'Imaginative, curious, and drawn to ideas, beauty, and novelty. You thrive in creative or intellectual environments.',           career:'Creative direction, theology, writing, innovation, teaching' },
      M:{label:'Balanced',              desc:'You balance curiosity with practicality. Open to new ideas while still appreciating what\'s proven and familiar.',              career:'Marketing, ministry, consulting, project-based roles' },
      L:{label:'Grounded',              desc:'Practical, consistent, and focused on the concrete. You prefer the reliable and proven over the experimental.',                  career:'Operations, administration, finance, structured ministry' } },
  C:{ H:{label:'Highly Conscientious', desc:'Disciplined, organized, and reliable. You hold yourself to a high standard and follow through on every commitment.',             career:'Management, law, ministry administration, project management' },
      M:{label:'Balanced',             desc:'Reasonably organized but flexible. You can work in structure or adapt when needed.',                                              career:'Team coordination, hybrid roles, mid-level ministry' },
      L:{label:'Flexible',             desc:'Spontaneous, big-picture, and free-flowing. Systems can feel constraining — you thrive on intuition.',                           career:'Creative roles, entrepreneurship, startups, missions' } },
  E:{ H:{label:'Highly Extraverted',   desc:'Energized by people and action. You thrive in high-contact, public-facing roles and love being around others.',                  career:'Sales, preaching, community leadership, brand ambassador' },
      M:{label:'Ambivert',             desc:'You recharge from both solitude and people. You can flex to meet either environment with ease.',                                  career:'Team ministry, coaching, marketing, mid-level leadership' },
      L:{label:'Introverted',          desc:'You draw energy from solitude and deep focus. You think before speaking and prefer depth over breadth.',                          career:'Writing, research, behind-the-scenes ministry, theology' } },
  A:{ H:{label:'Highly Agreeable',     desc:'Warm, cooperative, and empathetic. You put people first and instinctively seek harmony in relationships.',                       career:'Counseling, pastoral care, HR, collaborative ministry' },
      M:{label:'Balanced',             desc:'You can be cooperative or direct depending on what the situation requires.',                                                      career:'Leadership, team management, marketing, church planting' },
      L:{label:'Direct',               desc:'Assertive and mission-focused. Willing to challenge the status quo even at relational cost.',                                     career:'Executive roles, negotiation, visionary leadership, advocacy' } },
  N:{ H:{label:'Emotionally Sensitive',desc:'You feel deeply and carry the emotional weight of situations. Empathy is a strength — strong community support is key.',          career:'Roles with community, mentorship, counseling, and clear purpose' },
      M:{label:'Emotionally Moderate', desc:'You handle stress reasonably well. Clear expectations and strong team culture help you do your best work.',                       career:'Ministry, marketing, and team-based environments' },
      L:{label:'Emotionally Stable',   desc:'Calm under pressure, resilient, and hard to rattle. People look to you in difficult moments.',                                   career:'Crisis leadership, high-stakes ministry, executive roles' } },
}

interface Interp { label: string; desc: string; career: string }

// ─── CONNECTION STYLE ─────────────────────────────────────────────────────────

export interface ConnectStyle {
  name: string; icon: string; color: string
  desc: string; give: string; receive: string; career: string
}

export const CONNECT_STYLES: Record<string, ConnectStyle> = {
  W:{ name:'The Encourager',      icon:'💬', color:'#C9A84C',
    desc:'Words are how you love. Specific, sincere verbal affirmation — spoken or written — is your most powerful way of connecting. The right words at the right time mean everything to you.',
    give:'You speak life over people. You notice what\'s good and say it out loud. Notes, texts, and spoken praise are your love currency.',
    receive:'You feel most valued when someone tells you specifically what they appreciate about you. Generalities don\'t land — specificity does.',
    career:'Seek environments where feedback and verbal recognition are part of the culture — coaching, collaborative ministry, encouragement-rich teams.' },
  Q:{ name:'The Presencegiver',   icon:'⏳', color:'#7C9EF8',
    desc:'Undivided presence is your love currency. Distracted togetherness feels hollow. Focused, intentional time — no phones, no multitasking — is what fills your cup.',
    give:'You clear your schedule, put everything down, and give people your full, undivided attention.',
    receive:'You feel most loved when someone chooses you — not what you can do for them, just you. Time spent fully present says more than any gift.',
    career:'Team-oriented environments where meaningful collaboration and genuine human connection happen regularly.' },
  G:{ name:'The Thoughtful Giver',icon:'🎁', color:'#7CCC8E',
    desc:'Thoughtfulness made tangible. For you, a gift isn\'t about money — it\'s a symbol of being truly known. A small, specific item that shows someone was paying attention means the world.',
    give:'You notice what people love and find ways to make that real for them.',
    receive:'When someone brings you something that says "I saw this and thought of you," it communicates deep care and attention.',
    career:'Cultures of honor, celebration, and recognition — certain ministry communities, creative agencies, and high-care teams.' },
  S:{ name:'The Servant',         icon:'🙌', color:'#F4845F',
    desc:'Love in action. What you do speaks louder than what you say. When someone steps in to carry your load without being asked, that\'s love in its purest form to you.',
    give:'You show love by doing things — helping someone move, cooking a meal, handling logistics, solving a problem they haven\'t asked you to solve.',
    receive:'When someone helps without being told, it communicates deep respect and care. Unsolicited service is your clearest signal of love.',
    career:'Servant-leadership roles, ministry operations, hands-on community work — anywhere your practical help visibly serves others.' },
  T:{ name:'The Close One',       icon:'🤝', color:'#5BC4BF',
    desc:'Presence and warmth through physical closeness. Not just romance — a handshake, a hug, a hand on a shoulder communicates safety and belonging to you.',
    give:'You show love through physical presence: a reassuring touch, sitting close, a hug at the right moment.',
    receive:'Physical closeness and appropriate affectionate touch tell you that you\'re safe, known, and loved.',
    career:'In-person community environments, pastoral work, healthcare, or any high-trust setting where physical presence matters.' },
}

export interface ConnectQuestion { a: string; tA: string; b: string; tB: string }

export const CONNECT_Q: ConnectQuestion[] = [
  { a:"I love receiving encouraging notes or messages from people I care about.",                  tA:"W", b:"I feel loved when someone hugs me or puts a hand on my shoulder.",                      tB:"T" },
  { a:"I feel most connected when someone gives me their full, undivided attention.",              tA:"Q", b:"I feel loved when someone does something helpful without being asked.",                  tB:"S" },
  { a:"A small, thoughtful gift that shows someone was thinking of me means a lot.",               tA:"G", b:"Hearing someone tell me specifically what they love about me means a lot.",             tB:"W" },
  { a:"Being fully present with someone — phone away — is how I feel connected.",                 tA:"Q", b:"Physical affection like a hug or comforting touch grounds me.",                         tB:"T" },
  { a:"Sincere words of appreciation fill my emotional tank.",                                     tA:"W", b:"When someone takes something off my plate without being asked, I feel deeply loved.",   tB:"S" },
  { a:"Receiving a thoughtful, unexpected gift speaks louder than words to me.",                   tA:"G", b:"Leisurely, unhurried time with someone I care about is priceless to me.",              tB:"Q" },
  { a:"A hand on my back or a hug from someone I trust makes me feel safe.",                      tA:"T", b:"When someone speaks well of me to others, it means everything.",                        tB:"W" },
  { a:"When someone helps me practically — cooking, driving, fixing something — I feel loved.",   tA:"S", b:"When someone gives me their complete attention, I feel truly cared for.",               tB:"Q" },
  { a:"A birthday or holiday gift chosen specifically for me shows real thoughtfulness.",          tA:"G", b:"A reassuring touch on my arm when I'm stressed communicates care.",                    tB:"T" },
  { a:"I love sitting close to someone I care about — physical proximity matters.",               tA:"T", b:"When someone rearranges their schedule to make time for me, I feel loved.",             tB:"Q" },
  { a:"Hearing specifically what someone values about me touches me deeply.",                      tA:"W", b:"When someone steps in to help me without me having to ask, I feel valued.",            tB:"S" },
  { a:"A small but meaningful token that says 'I thought of you' fills my cup.",                  tA:"G", b:"Undivided, uninterrupted time with someone I care about fills my cup.",                tB:"Q" },
  { a:"Physical closeness — a hug, a hand on my shoulder — tells me I'm loved.",                 tA:"T", b:"Encouraging, specific words that speak into who I am stay with me for years.",         tB:"W" },
  { a:"When someone handles something I've been stressed about, I feel deeply cared for.",        tA:"S", b:"A personalized, meaningful gift tells me someone really knows me.",                    tB:"G" },
  { a:"Hearing sincere, specific praise for what I've done lifts me.",                            tA:"W", b:"A hug or physical presence at the right moment communicates more than words.",         tB:"T" },
  { a:"Spending time doing something together — fully present — is meaningful.",                  tA:"Q", b:"Giving or receiving a thoughtful gift that says 'I was thinking of you' matters.",    tB:"G" },
  { a:"When someone helps carry the load I've been carrying, I feel loved.",                      tA:"S", b:"Being physically close to people I love makes me feel connected.",                     tB:"T" },
  { a:"Being recognized with sincere words — especially in front of others — affirms me.",        tA:"W", b:"Receiving a gift with real thought and effort behind it moves me deeply.",             tB:"G" },
  { a:"Committed, focused time together tells me I matter to someone.",                           tA:"Q", b:"When someone helps me out without needing to be told twice, I feel valued.",           tB:"S" },
  { a:"Physical closeness and touch help me feel connected and secure.",                          tA:"T", b:"Being affirmed with genuine words fills something in me.",                             tB:"W" },
  { a:"A gift chosen specifically for me says 'I see you' in a way words can't.",                 tA:"G", b:"Someone who's truly present — not distracted — makes me feel loved.",                 tB:"Q" },
  { a:"When someone does a kind act for me, it communicates love.",                               tA:"S", b:"A hand on my shoulder or a hug during a hard time speaks volumes.",                   tB:"T" },
  { a:"Specific words of encouragement mean more to me than almost anything.",                    tA:"W", b:"A gift that shows someone noticed what I love tells me I'm known.",                   tB:"G" },
  { a:"When someone shows up and does something useful for me, I feel cared for.",                tA:"S", b:"Shared experiences — doing life side by side — fill my cup.",                         tB:"Q" },
  { a:"A hand on my shoulder at the right moment communicates everything.",                       tA:"T", b:"A thoughtful gift — even small — tells me someone was thinking of me.",               tB:"G" },
  { a:"Specific, sincere affirmation speaks directly to my heart.",                               tA:"W", b:"Focused quality time with someone I care about is what I treasure most.",             tB:"Q" },
  { a:"Practical help — someone taking something off my plate — shows love.",                     tA:"S", b:"Physical presence and warmth in a hard moment grounds me.",                           tB:"T" },
  { a:"A meaningful gift — thoughtful, not expensive — communicates deep love.",                  tA:"G", b:"Practical acts of service show love more clearly than words ever could.",             tB:"S" },
  { a:"Hearing someone say they believe in me changes something in me.",                          tA:"W", b:"Physical presence — being right there with me — is what I need most.",               tB:"T" },
  { a:"Intentional, focused time with someone tells me I'm a priority.",                          tA:"Q", b:"A gift that shows someone truly paid attention to who I am means the world.",        tB:"G" },
]

// ─── SCORING FUNCTIONS ───────────────────────────────────────────────────────

export function scoreTalent(answers: Record<number, 'a'|'b'>): TalentScores {
  const s: TalentScores = {}
  Object.keys(TALENT_THEMES).forEach(t => s[t] = 0)
  TALENT_Q.forEach((q, i) => {
    if (answers[i] === 'a') s[q.tA] = (s[q.tA] || 0) + 1
    else if (answers[i] === 'b') s[q.tB] = (s[q.tB] || 0) + 1
  })
  return s
}

export function scoreOcean(answers: Record<number, number>): OceanScores {
  const raw = { O:0, C:0, E:0, A:0, N:0 }
  OCEAN_ITEMS.forEach(item => {
    const v = answers[item.id]
    if (!v) return
    const trait = item.t as keyof typeof raw
    raw[trait] += item.r ? (6 - v) : v
  })
  return {
    O: Math.round((raw.O / 50) * 100),
    C: Math.round((raw.C / 50) * 100),
    E: Math.round((raw.E / 50) * 100),
    A: Math.round((raw.A / 50) * 100),
    N: Math.round((raw.N / 50) * 100),
  }
}

export function scoreConnect(answers: Record<number, 'a'|'b'>): ConnectScores {
  const s = { W:0, Q:0, G:0, S:0, T:0 }
  CONNECT_Q.forEach((q, i) => {
    if (answers[i] === 'a') s[q.tA as keyof typeof s]++
    else if (answers[i] === 'b') s[q.tB as keyof typeof s]++
  })
  return s
}

export function getOceanInterp(trait: string, pct: number): Interp {
  const t = OCEAN_INTERP[trait]
  if (pct >= 65) return t.H
  if (pct <= 35) return t.L
  return t.M
}

export function getTalentTop5(scores: TalentScores): string[] {
  return Object.entries(scores).sort((a,b) => b[1]-a[1]).slice(0,5).map(([n]) => n)
}

export function getTalentDomain(name: string): string {
  return Object.entries(TALENT_DOMAINS).find(([,v]) => v.themes.includes(name))?.[0] || ''
}

export function getPrimaryConnect(scores: ConnectScores): string {
  return Object.entries(scores).sort((a,b) => b[1]-a[1])[0][0]
}
