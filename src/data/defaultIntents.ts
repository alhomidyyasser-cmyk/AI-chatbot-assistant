import { Intent } from '../utils/nn';

export const DEFAULT_INTENTS: Intent[] = [
  {
    tag: 'greetings',
    patterns: [
      'hello',
      'hi',
      'hey',
      'greetings',
      'howdy',
      'is anyone there',
      'good day',
      'مرحبا',
      'السلام عليكم',
      'هلا',
      'صباح الخير',
      'مساء الخير',
      'كيف حالك'
    ],
    responses: [
      'مرحباً بك! كيف يمكنني مساعدتك اليوم؟ 😊',
      'أهلاً وسهلاً! يسعدني التحدث إليك كيف يمكنني خدمتك؟',
      'السلام عليكم ورحمة الله! أتمنى لك يوماً رائعاً، كيف أساعدك؟ 👋',
      'Hello there! How can I help you today? ✨',
      'Hi! Great to connect with you. What is on your mind?',
      'Hey! I am ready to help you out. Go ahead!'
    ]
  },
  {
    tag: 'goodbye',
    patterns: [
      'bye',
      'goodbye',
      'see you later',
      'i am leaving',
      'talk to you later',
      'farewell',
      'مع السلامة',
      'وداعا',
      'إلى اللقاء',
      'باي',
      'أراك لاحقا'
    ],
    responses: [
      'رافقتك السلامة! أراك قريباً إن شاء الله. 💖',
      'إلى اللقاء! لا تتردد في العودة والتحدث معي ثانية.',
      'في أمان الله وحفظه! أتمنى لك التوفيق.',
      'Goodbye! Have a stellar day ahead! 🚀',
      'Bye! Looking forward to our next chat.',
      'Take care! Let me know when you need me again.'
    ]
  },
  {
    tag: 'thanks',
    patterns: [
      'thanks',
      'thank you',
      'that is helpful',
      'awesome',
      'thank you so much',
      'شكرا',
      'شكرا لك',
      'تسلم',
      'مشكور',
      'يعطيك العافية'
    ],
    responses: [
      'على الرحب والسعة! هذا واجبي. 🥰',
      'العفو! أنا هنا دائماً في خدمتك.',
      'الله يعافيك ويسلمك! سررت بمساعدتك.',
      'You are very welcome! Glad I could help.🌟',
      'Anytime! Let me know if there is anything else.',
      'My pleasure! Happy to be of assistance.'
    ]
  },
  {
    tag: 'about_bot',
    patterns: [
      'who are you',
      'what is your name',
      'tell me about yourself',
      'describe yourself',
      'من أنت',
      'ما هو اسمك',
      'عرفني بنفسك',
      'وش هويتك'
    ],
    responses: [
      'أنا مساعدك الذكي المبني بنظام تعلم شبكي عصبي محلي! 🧠🤖',
      'اسمي مساعد الذكاء الاصطناعي التفاعلي، مصمم بأناقة لمساعدتك في الإجابة عن الأسئلة وتبسيط المفاهيم.',
      'I am your intelligent custom-trained Chatbot Assistant. Powered by a local multi-layer feedforward neural network!',
      'I am an AI Companion. I analyze your words using NLP and feed them into my custom brainstorm neurons.'
    ]
  },
  {
    tag: 'joke',
    patterns: [
      'tell me a joke',
      'make me laugh',
      'do you know any jokes',
      'قل لي نكتة',
      'أريد نكتة',
      'اضحكني',
      'مزحة'
    ],
    responses: [
      'لماذا يذهب الكمبيوتر إلى الشاطئ؟ لكي يبحث عن "الشبكة"! 🏖️💻',
      'واحد يسأل مبرمج: كيف الجو اليوم؟ رد المبرمج: الجو غائم جزئياً ويوجد احتمال 404 خطأ في الهطول! 🌧️',
      'Why do programmers wear glasses? Because they cannot C#! 🤓',
      'Why did the computer catch a cold? It left its Windows open! ❄️',
      'How many programmers does it take to change a light bulb? None, that is a hardware problem!'
    ]
  },
  {
    tag: 'help',
    patterns: [
      'help',
      'i need help',
      'what can you do',
      'guide me',
      'مساعدة',
      'كيف تعمل',
      'وش تسوي',
      'ماذا يمكنك أن تفعل'
    ],
    responses: [
      'يمكنني تصنيف النصوص، الإجابة عن الأسئلة، سرد النكات وتوضيح كيفية عمل شبكة التعلم الآلي! جرب التفاعل معي.',
      'أنا مدرب على قراءة كلامك، تحليله لجذور الكلمات الأساسية، وتخمين الموضوع بأعلى دقة. جرب كتابة "السلام عليكم". 👋',
      'I can guide you through Neural Network mechanics, answer queries, crack jokes, or demo real-time stemming. Explore the workspace!',
      'Just type a friendly greeting, ask for a joke, or try editing my dataset inside the Intents explorer!'
    ]
  }
];
