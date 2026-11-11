/* Khatti language layer (khatti.lang.v1): the whole UI in English or in Arabic (RTL).
   Screens keep their English source strings; in Arabic mode this layer swaps visible text and
   accessible labels as they render (MutationObserver), including inside the Khatti Loop iframe.
   Switching language stores the choice and reloads, so nothing has to be swapped back. */
const KL_KEY='khatti.lang.v1';
function klLang(){try{const v=localStorage.getItem(KL_KEY);if(v==='ar'||v==='en')return v;}catch{}const n=(navigator.languages&&navigator.languages[0])||navigator.language||'';return /^ar\b/i.test(n)?'ar':'en';}
const KL_LANG=klLang();
const KL_NAMES={Alif:'ألف',Ba:'باء',Dal:'دال',Ra:'راء',Sin:'سين',Ayn:'عين',Mim:'ميم',Lam:'لام',Ta:'تاء',Tha:'ثاء',Jim:'جيم',Ha:'حاء',Kha:'خاء',Dhal:'ذال',Zay:'زاي',Shin:'شين',Sad:'صاد',Dad:'ضاد','Ta (emphatic)':'طاء',Zha:'ظاء',Ghayn:'غين',Fa:'فاء',Qaf:'قاف',Kaf:'كاف',Nun:'نون','Ha (final)':'هاء',Waw:'واو',Ya:'ياء',
 La:'لا',Allah:'الله',Bismillah:'بسم الله',Alhamdulillah:'الحمد لله',Subhanallah:'سبحان الله','Allahu Akbar':'الله أكبر','Masha’Allah':'ما شاء الله',
 Patience:'الصبر',Effort:'الاجتهاد',Brevity:'الإيجاز',Knowledge:'العلم',Time:'الوقت',
 'Al-Ikhlas 112:1':'الإخلاص 112:1','Al-Fatihah 1:2':'الفاتحة 1:2','Al-Fatihah 1:5':'الفاتحة 1:5','Ash-Sharh 94:6':'الشرح 94:6','Al-Baqarah 2:152':'البقرة 2:152',
 Nur:'نور',Lawn:'لون',Bism:'بسم','Your Bism':'بسمك'};
const KL_TIERS={'Al-Mufradat':'المفردات','Al-Murakkabat':'المركّبات','Al-Hikam':'الحِكَم','Al-Lawha':'اللوحة'};
const KL_ORD={1:'الأولى',2:'الثانية',3:'الثالثة',4:'الرابعة'};
const klN=x=>KL_NAMES[x]||x;
const KL_AR={
 // brand & header
 'Khatti':'خطّي','· by QariAI':'· من QariAI','My work':'أعمالي','Khatti · by QariAI':'خطّي · من QariAI',
 // home
 'Learn Arabic calligraphy the way it’s written: by hand.':'تعلّم الخط العربي كما يُكتب: بيدك.','28 letters, four tiers, one pen.':'28 حرفًا، أربع مراحل، قلم واحد.',
 'notebook · free draw':'دفتر · رسم حر','plain page · free draw':'صفحة بيضاء · رسم حر','Notebook':'دفتر','Plain page':'صفحة بيضاء','Undo':'تراجع','Clear':'مسح','Redo':'إعادة',
 'Start the Path':'ابدأ الطريق','Start the Path →':'ابدأ الطريق ←','Take a break · Khatti Loop':'استراحة · لغز خطّي','A quick letter puzzle':'لغز حروف سريع','Nice line.':'خط جميل.','Try it on the Path':'جرّبه في الطريق','Try it on the Path →':'جرّبه في الطريق ←',
 'Ink toolkit':'أدوات الحبر','Nib size':'حجم القلم','Fine nib':'قلم رفيع','Medium nib':'قلم متوسط','Broad nib':'قلم عريض','Ink':'الحبر','Charcoal ink':'حبر فحمي','Ruby ink':'حبر ياقوتي',
 'Practice surface. Draw with touch, mouse or pen.':'مساحة التمرين. ارسم باللمس أو الفأرة أو القلم.','Studio':'المرسم','Choose your goal':'اختر هدفك','Dismiss update notice':'إخفاء إشعار التحديث',
 // welcome & intro
 'What do you want to write?':'ماذا تريد أن تكتب؟','The letters':'الحروف','Short duas':'أدعية قصيرة','Ayahs':'آيات','Not now':'ليس الآن','Open the Path':'افتح الطريق','Welcome back':'أهلًا بعودتك',
 'Every goal starts on The Scribe’s Path. Tap one to see where you’re heading.':'كل هدف يبدأ في طريق الخطّاط. اختر واحدًا لترى وجهتك.',
 'Welcome to Khatti':'مرحبًا بك في خطّي','Skip':'تخطَّ','Next →':'التالي ←','Next':'التالي','Khatti means':'«خطّي» تعني','my handwriting':'خطّ يدي',
 'One path. Four tiers.':'طريق واحد. أربع مراحل.','From single letters to full ayahs.':'من الحروف المفردة إلى الآيات الكاملة.','Letters':'حروف','Joins':'وصل','Wisdom':'حِكَم',
 'Draw with your finger.':'ارسم بإصبعك.','Earn stars. Seal every letter you master.':'اجمع النجوم واختم كل حرف تتقنه.','Every goal starts on The Scribe’s Path.':'كل هدف يبدأ في طريق الخطّاط.','Just let me draw':'دعني أرسم فقط',
 // path map
 '← Home':'→ الرئيسية','The Scribe’s Path':'طريق الخطّاط','Four tiers from single letters to full ayahs. Reach an average of 80% in a tier to open the next (in Tier 1, the first 8 letters).':'أربع مراحل من الحروف المفردة إلى الآيات الكاملة. احصل على متوسط 80% في مرحلة لتفتح التي تليها (في المرحلة الأولى: أول 8 حروف).',
 'Single letters · stroke control':'حروف مفردة · ضبط الحركة','Short duas · letter joins':'أدعية قصيرة · وصل الحروف','Wisdom & proverbs · rhythm and baseline':'حِكَم وأمثال · الإيقاع والسطر','Ayahs · composition, tashkeel, spacing':'آيات · التكوين والتشكيل والمسافات',
 'The full alphabet':'الأبجدية كاملة','Practice only · not needed to unlock Tier 2':'للتمرين فقط · لا يلزم لفتح المرحلة الثانية','Start here · lesson':'ابدأ هنا · درس','✓ Done · practise again':'✓ تمّ · تمرّن مجددًا',
 'Joins · Build بسم from its three joining forms':'الوصل · ابنِ «بسم» من أشكالها الثلاثة','Joins done ✦ Now write them in phrases: start with لا':'أتممت الوصل ✦ اكتبه الآن في عبارات: ابدأ بـ لا',
 'Memory Seal: written from memory':'ختم الذاكرة: كُتب من الذاكرة','Lawha ✦':'لوحة ✦','Claim Lawha ✦':'احصل على اللوحة ✦',
 // practice & result
 'Check':'تحقّق','Peek':'لمحة','Try again':'حاول مجددًا','Map':'الخريطة','Back to the map':'العودة إلى الخريطة','Writing surface':'مساحة الكتابة','Close':'إغلاق',
 'Not yet — trace the guide slowly and keep the whole shape in view.':'ليس بعد — تتبّع الدليل ببطء وأبقِ الشكل كاملًا أمامك.','Write something first, then press Check.':'اكتب شيئًا أولًا، ثم اضغط «تحقّق».',
 'Traditional proverb.':'مثل مأثور.','Your plate':'لوحتك','Lawha plate':'اللوحة','Background texture':'خلفية الورق','Share':'مشاركة','Save PNG':'حفظ صورة','Use Save PNG':'استخدم «حفظ صورة»','Gold foil':'ورق ذهبي',
 // letter & item notes
 'The vertical staff: every letter is measured against it.':'العصا القائمة: يُقاس بها كل حرف.','A shallow bowl with a single dot beneath.':'قوس منبسط تحته نقطة واحدة.','A compact hook that turns on a firm baseline.':'خطّاف صغير ينعطف على سطر ثابت.',
 'A quick descending curve below the line.':'انحناءة سريعة تنزل تحت السطر.','Three teeth in rhythm.':'ثلاث أسنان متناغمة.','An open eye over a sweeping tail.':'عين مفتوحة فوق ذيل منساب.','A closed head with a short tail.':'رأس مغلق بذيل قصير.',
 'A tall stem and a deep, round tail.':'ساق طويلة وذيل عميق مستدير.','Two dots above a shallow bowl.':'نقطتان فوق قوس منبسط.','Three dots above a shallow bowl.':'ثلاث نقاط فوق قوس منبسط.','A hook that opens beneath a single dot.':'خطّاف ينفتح تحت نقطة واحدة.',
 'The open hook, no dot.':'الخطّاف المفتوح بلا نقطة.','The open hook with a dot above.':'الخطّاف المفتوح فوقه نقطة.','Dal with a dot above.':'دال فوقها نقطة.','Ra with a dot above.':'راء فوقها نقطة.','Sin with three dots above.':'سين فوقها ثلاث نقاط.',
 'A closed loop with a sweeping tail.':'عقدة مغلقة بذيل منساب.','Sad with a dot above.':'صاد فوقها نقطة.','A loop with a tall stem.':'عقدة بساق طويلة.','Ta with a dot above.':'طاء فوقها نقطة.','Ayn with a dot above.':'عين فوقها نقطة.',
 'A loop with one dot above.':'عقدة فوقها نقطة واحدة.','A loop with two dots, deep tail.':'عقدة بنقطتين وذيل عميق.','A stem and a slanted bar.':'ساق وشَرطة مائلة.','A deep bowl with a dot above.':'قوس عميق فوقه نقطة.','A small closed knot.':'عقدة صغيرة مغلقة.',
 'A round head with a curling tail.':'رأس مستدير بذيل ملتف.','A long tail turning back, two dots beneath.':'ذيل طويل يرتدّ للخلف، تحته نقطتان.',
 'Lam-alif: the classic crossing join.':'لام ألف: الوصل المتقاطع الكلاسيكي.','The name, with its shadda and standing alif.':'لفظ الجلالة بشدّته وألفه القائمة.','The opening of every surah but one.':'مطلع كل السور إلا واحدة.',
 'A phrase of gratitude.':'عبارة شكر.','A phrase of wonder.':'عبارة تعجّب وتنزيه.','Two words, one balanced line.':'كلمتان في سطر متوازن.','A phrase of appreciation.':'عبارة إعجاب وتبريك.',
 'Qur’an 112:1':'القرآن 112:1','Qur’an 1:2':'القرآن 1:2','Qur’an 1:5':'القرآن 1:5','Qur’an 94:6 · standard orthography, verify against your mushaf':'القرآن 94:6 · بالرسم الإملائي، راجعه على مصحفك','Qur’an 2:152 · standard orthography, verify against your mushaf':'القرآن 2:152 · بالرسم الإملائي، راجعه على مصحفك',
 'La · La':'لا','Allah · Allah':'الله','Bismillah · In the name of God':'بسم الله','Alhamdulillah · Praise be to God':'الحمد لله','Subhanallah · Glory be to God':'سبحان الله','Allahu Akbar · God is the Greatest':'الله أكبر','Masha’Allah · As God willed':'ما شاء الله',
 'Patience · Patience is the key to relief':'الصبر','Effort · Whoever strives, finds':'الاجتهاد','Brevity · The best speech is brief and to the point':'الإيجاز','Knowledge · Knowledge is light':'العلم','Time · Time is like a sword':'الوقت',
 'Al-Ikhlas 112:1 · Say: He is God, the One.':'الإخلاص 112:1','Al-Fatihah 1:2 · All praise is for God, Lord of the worlds.':'الفاتحة 1:2','Al-Fatihah 1:5 · You alone we worship; You alone we ask for help.':'الفاتحة 1:5','Ash-Sharh 94:6 · Indeed, with hardship comes ease.':'الشرح 94:6','Al-Baqarah 2:152 · Remember Me; I will remember you.':'البقرة 2:152',
 // joins lesson
 'Connected words':'الكلمات الموصولة','Brush':'الفرشاة','Guide':'الدليل','Compose':'التركيب','Forms':'الأشكال','Spacing':'المسافة','Model':'النموذج','Export':'تصدير','Finish':'إنهاء','Save':'حفظ',
 'Back to studio':'العودة إلى المرسم','Your word taking shape':'كلمتك تتشكّل','Connected drawing tools':'أدوات الرسم الموصول','Composition tools':'أدوات التركيب','Your connected Bism word':'كلمة «بسم» الموصولة',
 'Join in':'نقطة الدخول','Join out':'نقطة الخروج','Join point found.':'وُجدت نقطة الوصل.','Join spacing':'مسافة الوصل','Tighter ↔ Looser':'أضيق ↔ أوسع','Put it together':'اجمعها معًا','Bring it all together.':'اجمع كل شيء معًا.','A word in your hand.':'كلمة بخط يدك.',
 'YOUR THREE FORMS, CONNECTED':'أشكالك الثلاثة موصولة','YOUR SAVED WORD':'كلمتك المحفوظة','Revisit the forms':'راجع الأشكال','Save connected piece':'احفظ القطعة الموصولة','Download PNG':'تنزيل PNG','Download SVG':'تنزيل SVG','Download form':'تنزيل الشكل','Remove piece':'حذف القطعة',
 'Your connected pieces.':'قطعك الموصولة.','← Back to your current word':'→ العودة إلى كلمتك الحالية','Bism · connected study':'بسم · دراسة موصولة','Saved your connected piece on this device.':'حُفظت قطعتك الموصولة على هذا الجهاز.','Draw the three forms, then save your assembled piece.':'ارسم الأشكال الثلاثة، ثم احفظ قطعتك المجمّعة.',
 'Moves your forms without stretching or mirroring them.':'يحرّك أشكالك دون مطّها أو قلبها.','Tighter ← · → Looser. This moves the forms without stretching or mirroring them.':'أضيق ← · → أوسع. يحرّك الأشكال دون مطّها أو قلبها.',
 'Unvocalized Bism study · draft model, review pending. Your drawings are not automatically assessed.':'دراسة «بسم» بلا تشكيل · نموذج أولي قيد المراجعة. رسوماتك لا تُقيَّم آليًا.','Unvocalized study · model review pending. The guide is excluded from exports.':'دراسة بلا تشكيل · النموذج قيد المراجعة. الدليل لا يظهر في التصدير.',
 'Private on this device · creative study · no automatic assessment':'خاص على هذا الجهاز · دراسة إبداعية · بلا تقييم آلي','Remove this connected piece?':'حذف هذه القطعة الموصولة؟','Keep it':'أبقِها','Your first connected word belongs here.':'مكان كلمتك الموصولة الأولى هنا.',
 'Your collection has eight pieces. Download or remove one before saving another. Existing pieces are kept.':'مجموعتك فيها ثماني قطع. نزّل واحدة أو احذفها قبل حفظ أخرى. القطع الحالية محفوظة.','This form has 32 strokes. Undo or download it before adding more.':'هذا الشكل فيه 32 حركة. تراجع أو نزّله قبل الإضافة.',
 // my work
 '← Your studio':'→ مرسمك','PRIVATE ON THIS DEVICE':'خاص على هذا الجهاز','Private on this device':'خاص على هذا الجهاز','MY WORK':'أعمالي','Made by you.':'من صنع يدك.','Pick up a draft, revisit your practice or finish a piece for sharing.':'أكمل مسودة، أو راجع تمارينك، أو أنهِ قطعة للمشاركة.',
 'All work':'كل الأعمال','Drawings':'الرسومات','Name practice':'تمرين الاسم','Practice':'التمارين','Your drawings appear here automatically and stay on this device.':'تظهر رسوماتك هنا تلقائيًا وتبقى على هذا الجهاز.','Pick up a drawing where you left off, or export it to share.':'تابع رسمك من حيث توقفت، أو صدّره لتشاركه.','Resume drawing':'تابع الرسم','Resume practice':'تابع التمرين','Open & export':'افتح وصدّر','View & export':'اعرض وصدّر','Memory Seal — written from memory!':'ختم الذاكرة — كتبته من الذاكرة!','Filter your work':'تصفية أعمالك','Your next piece starts with a mark.':'قطعتك التالية تبدأ بأثر قلم.','Nothing here yet.':'لا شيء هنا بعد.','Choose another filter to see your saved work.':'اختر تصفية أخرى لترى أعمالك المحفوظة.',
 'Drawing drafts and name practice appear here automatically. Save finished posters to keep their design.':'تظهر هنا مسودات الرسم وتمارين الاسم تلقائيًا. احفظ الملصقات المكتملة لتحتفظ بتصميمها.',
 'Start on the Path →':'ابدأ في الطريق ←','Your collection is saved on this device.':'مجموعتك محفوظة على هذا الجهاز.','Install & offline':'التثبيت والعمل دون اتصال','Back up / restore':'نسخ احتياطي / استعادة','Replay intro':'إعادة المقدمة','Privacy':'الخصوصية',
 'Autosaved draft':'مسودة محفوظة تلقائيًا','Your free canvas':'لوحتك الحرة','Resume drawing →':'تابع الرسم ←','My free drawing':'رسمي الحر','Saved drawing':'رسم محفوظ','Framed poster':'ملصق مؤطّر','Frame & export':'تأطير وتصدير','Share poster':'مشاركة الملصق',
 'Saved to My work.':'حُفظ في أعمالي.','Already saved to My work.':'محفوظ مسبقًا في أعمالي.','This artwork could not be saved. Export it before closing.':'تعذّر حفظ هذا العمل. صدّره قبل الإغلاق.',
 // loop
 'Khatti Loop':'لغز خطّي','Khatti Loop puzzle':'لغز خطّي','Hint':'تلميح','Reshuffle':'خلط','Continue':'متابعة','Sound on':'الصوت مفعّل','Sound off':'الصوت متوقف','Sound':'الصوت','Tiles reshuffled.':'خُلطت القطع.',
 'Beautifully joined.':'وصلٌ جميل.','Every line, connected.':'كل خط موصول.','Peace in the pattern.':'سكينة في النقش.','The loop is closed.':'اكتملت الحلقة.','Calm, and complete.':'هدوء واكتمال.',
 'Puzzle board. Arrow keys move, Space or Enter turns a tile.':'لوحة اللغز. الأسهم للتنقّل، والمسافة أو Enter لتدوير القطعة.',
 'Dark mode':'الوضع الداكن','Pilot chapter':'الفصل التجريبي','Guided lesson paths':'مسارات الدروس','Creative level progress':'تقدّم المستوى',
 // pwa & backup
 'Update now':'حدّث الآن','Update available. Your saved work stays on this device.':'يتوفر تحديث. أعمالك المحفوظة تبقى على هذا الجهاز.','Close install options':'إغلاق خيارات التثبيت','Back up your work':'انسخ أعمالك احتياطيًا','Keep your saved work':'احتفظ بأعمالك المحفوظة','Close progress transfer':'إغلاق نقل التقدّم',
 'Cannot check while offline. Your cached studio remains available.':'لا يمكن التحقق دون اتصال. مرسمك المخزّن يبقى متاحًا.','Preparing offline files. Stay online until this reports ready.':'جارٍ تجهيز ملفات العمل دون اتصال. ابقَ متصلًا حتى يكتمل.',
 'Offline package installed in this browser. Reopen this same address to use it offline.':'ثُبّتت الحزمة في هذا المتصفح. افتح العنوان نفسه لتستخدمه دون اتصال.'
};
const KL_LOOPNOTE={'the first letter':'الحرف الأول','the second letter':'الحرف الثاني','the 25th letter':'الحرف الخامس والعشرون','the 23rd letter':'الحرف الثالث والعشرون','the 27th letter':'الحرف السابع والعشرون','the 24th letter':'الحرف الرابع والعشرون','the 10th letter':'الحرف العاشر','light':'نور','colour':'لون'};
const KL_PAT=[
 [/^(\d+)% avg$/,m=>'المتوسط \u200F'+m[1]+'%'],
 [/^Continue · (.+?)(\s*→)?$/,m=>'تابع · '+klN(m[1])+(m[2]?' ←':'')],
 [/^Attempt (\d+)$/,m=>'المحاولة '+m[1]],
 [/^Guide (\d+)% · Attempt (\d+)$/,m=>'الدليل '+m[1]+'% · المحاولة '+m[2]],
 [/^Coverage (\d+)% · Precision (\d+)% · Proportion (\d+)%(?: · Angle (\d+)%)?$/,m=>'التغطية '+m[1]+'% · الدقة '+m[2]+'% · التناسب '+m[3]+'%'+(m[4]?' · الزاوية '+m[4]+'%':'')],
 [/^Tier (\d) · (.+)$/,m=>'المرحلة '+(KL_ORD[m[1]]||m[1])],
 [/^Tier (\d) (Al-[A-Za-z]+)$/,m=>'المرحلة '+(KL_ORD[m[1]]||m[1])+' '+(KL_TIERS[m[2]]||m[2])],
 [/^🔓 Tier (\d) · (.+) is open\.$/,m=>'🔓 فُتحت المرحلة '+(KL_ORD[m[1]]||m[1])+' · '+(KL_TIERS[m[2]]||m[2])+'.'],
 [/^Locked · reach (\d+)% average in (Al-[A-Za-z]+)( \(first 8 letters\))? \(now (\d+)%\)\.$/,m=>'مقفلة · احصل على متوسط '+m[1]+'% في '+(KL_TIERS[m[2]]||m[2])+(m[3]?' (أول 8 حروف)':'')+' (الآن '+m[4]+'%).'],
 [/^The guide fades as you practise: it is (\d+)% next time\.$/,m=>'يتلاشى الدليل كلما تمرّنت: سيكون '+m[1]+'% في المرة القادمة.'],
 [/^Memory Seal — written from memory! \+(\d+) XP$/,m=>'ختم الذاكرة — كتبته من الذاكرة! +'+m[1]+' نقطة'],
 [/^\+(\d+) XP$/,m=>'+'+m[1]+' نقطة'],
 [/^Practice (.+)$/,m=>'تمرين '+klN(m[1])],
 [/^(\d) of 3 stars$/,m=>m[1]+' من 3 نجوم'],
 [/^It’s been (\d+) days\. Pick up where you left off on The Scribe’s Path\.$/,m=>'مرّ '+m[1]+' يومًا. تابع من حيث توقفت في طريق الخطّاط.'],
 [/^Level (\d+)$/,m=>'المستوى '+m[1]],
 [/^Level (\d+)\. Join every line to reveal a letter or word\.$/,m=>'المستوى '+m[1]+'. صِل كل الخطوط لتكشف حرفًا أو كلمة.'],
 [/^Level (\d+) complete\. You revealed (\w+), (.+)\.$/,m=>'اكتمل المستوى '+m[1]+'. كشفت '+klN(m[2])+'، '+(KL_LOOPNOTE[m[3]]||m[3])+'.'],
 [/^(\S+) · (\w+), (.+)\.$/,m=>KL_LOOPNOTE[m[3]]?m[1]+' · '+klN(m[2])+'، '+KL_LOOPNOTE[m[3]]+'.':null],
 [/^(\d+) tiles joined\.$/,m=>'وُصلت '+m[1]+' قطعة.'],
 [/^(\d) \/ 3 forms drawn$/,m=>'رُسم '+m[1]+' من 3 أشكال'],
 [/^Connected words · (\d)\/3$/,m=>'الكلمات الموصولة · '+m[1]+'/3'],
 [/^Connected words · Composition$/,()=>'الكلمات الموصولة · التركيب'],
 [/^Draw (.+?) with a finger, stylus or mouse(\. Join the marked rings\.)?$/,m=>'ارسم '+klN(m[1])+' بإصبعك أو بالقلم أو بالفأرة'+(m[2]?'. صِل الحلقات المحددة.':'')],
 [/^(.+?) ⌄$/,m=>klN(m[1])+' ⌄'],
 [/^Creative level (\d+), (\d+) XP$/,m=>'المستوى '+m[1]+'، '+m[2]+' نقطة'],
 [/^(\d+) ink tokens$/,m=>m[1]+' رمز حبر'],
 [/^★ (\d+)\/(\d+)$/,m=>'★ '+m[1]+'/'+m[2]]
];
const KL_ARROWS={'→':'←','←':'→','‹':'›','›':'‹'};
function klT(t){if(t&&KL_ARROWS[t.trim()]&&t.trim().length===1)return t.replace(t.trim(),KL_ARROWS[t.trim()]);if(!t||!/[A-Za-z]/.test(t))return null;const k=t.trim();if(!k)return null;let v=KL_AR[k];if(v===undefined&&KL_NAMES[k])v=KL_NAMES[k];if(v===undefined&&KL_TIERS[k])v=KL_TIERS[k];
 if(v===undefined)for(const [re,fn] of KL_PAT){const m=k.match(re);if(m){const r=fn(m);if(r){v=r;break;}}}
 if(v===undefined)return null;const lead=t.match(/^\s*/)[0],trail=t.match(/\s*$/)[0];return lead+v+trail;}
const KL_ATTRS=['aria-label','title','placeholder','alt'];
const KL_DONE=new WeakMap();
function klText(n){if(KL_DONE.get(n)===n.nodeValue)return;const r=klT(n.nodeValue);if(r!==null&&r!==n.nodeValue){n.nodeValue=r;}KL_DONE.set(n,n.nodeValue);}
function klApply(root){if(!root)return;const doc=root.ownerDocument||root;
 if(root.nodeType===3){klText(root);return;}
 if(root.nodeType!==1&&root.nodeType!==9)return;const el=root.nodeType===9?root.body:root;if(!el)return;
 if(el.nodeType===1&&/^(SCRIPT|STYLE|TEXTAREA)$/.test(el.tagName))return;
 const w=doc.createTreeWalker(el,4);let n;const list=[];while(n=w.nextNode())list.push(n);
 for(const t of list){const p=t.parentElement;if(p&&/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.tagName))continue;klText(t);}
 const els=el.nodeType===1?[el,...el.querySelectorAll('*')]:[];for(const e of els)for(const a of KL_ATTRS){const v=e.getAttribute&&e.getAttribute(a);if(v){const r=klT(v);if(r!==null&&r!==v)e.setAttribute(a,r);}}}
const KL_CSS='html[lang=ar] *,html[lang=ar] *::before,html[lang=ar] *::after{letter-spacing:normal!important}';
function klWatch(doc,frame){
 if(!doc||doc.__kl)return;doc.__kl=1;
 if(!frame){doc.documentElement.lang='ar';doc.documentElement.dir='rtl';}else{doc.documentElement.lang='ar';}
 const st=doc.createElement('style');st.textContent=KL_CSS+(frame?'body{direction:ltr}#lvl,#doneMsg,.pill,#sr{direction:rtl}':'');(doc.head||doc.documentElement).append(st);
 klApply(doc);
 new (doc.defaultView||window).MutationObserver(ms=>{for(const m of ms){if(m.type==='characterData')klApply(m.target);else if(m.type==='attributes'){const v=m.target.getAttribute(m.attributeName);const r=klT(v);if(r!==null&&r!==v)m.target.setAttribute(m.attributeName,r);}else m.addedNodes.forEach(n=>{klApply(n);klFrames(n);});}})
  .observe(doc.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:KL_ATTRS});
 if(!frame)klFrames(doc);}
function klFrames(n){if(!n||!n.querySelectorAll)return;const fs=n.tagName==='IFRAME'?[n]:[...n.querySelectorAll('iframe')];
 for(const f of fs){const go=()=>{try{const d=f.contentDocument;if(d&&d.body)klWatch(d,true);}catch{}};go();f.addEventListener('load',()=>{try{f.contentDocument.__kl=0;}catch{}go();});}}
/* Language toggle: in the header and on the intro */
function klToggleBtn(){const b=document.createElement('button');b.type='button';b.className='kl-toggle';b.dataset.klToggle='';b.lang=KL_LANG==='ar'?'en':'ar';
 b.textContent=KL_LANG==='ar'?'English':'عربي';b.setAttribute('aria-label',KL_LANG==='ar'?'Switch to English':'التبديل إلى العربية');return b;}
function klPlaceToggles(){const h=document.querySelector('.creative-header');if(h&&!h.querySelector('[data-kl-toggle]')){const mw=h.querySelector('.creative-mywork');mw?mw.before(klToggleBtn()):h.append(klToggleBtn());}
 const ki=document.querySelector('#khatti-intro');if(ki&&!ki.querySelector('[data-kl-toggle]')){const sk=ki.querySelector('.ki-skip');if(sk){const row=document.createElement('div');row.className='ki-top';sk.before(row);row.append(klToggleBtn(),sk);}}}
function installLang(){if(typeof document==='undefined'||window.__khattiLang)return;window.__khattiLang=KL_LANG;if(KL_LANG==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}
 document.addEventListener('click',e=>{const b=e.target.closest('[data-kl-toggle]');if(!b)return;e.preventDefault();try{localStorage.setItem(KL_KEY,KL_LANG==='ar'?'en':'ar');}catch{}location.reload();});
 const start=()=>{klPlaceToggles();new MutationObserver(klPlaceToggles).observe(document.body,{childList:true,subtree:true});if(KL_LANG==='ar')klWatch(document,false);};
 if(document.body)start();else document.addEventListener('DOMContentLoaded',start);}
window.khattiLang={lang:KL_LANG,t:klT};
installLang();
