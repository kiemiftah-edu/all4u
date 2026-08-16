// --- CONFIGURATION & TRANSLATIONS ---
const currentYear = new Date().getFullYear(); 
let globalHitCount = "..."; 

const styleCompatibility = {
    retro: [], 
    coretan: [] 
};

const artStylesMap = {
    "malay_chibi_25d": { name: "Cute Malaysian Chibi (2.5D)", desc: "Clearly recognizable Malaysian educational chibi style: cute local character proportions, big expressive eyes, rounded face, small body, modest outfit, soft 2.5D shading, clean classroom-friendly look, readable expressions, warm local visual identity.", tech: "2.5D Chibi Rendering, Soft Ambient Glow, Rounded Character Forms, Clean Educational Comic Finish, 8K Max Resolution", base_format: "Malaysian 2.5D Chibi Comic / Infographic" },
    "chibi_kawaii_vector": { name: "Chibi Kawaii Vector", desc: "Cute kawaii vector cartoon style with oversized head, small body, simple readable shapes, thick clean outlines, cheerful expression, sticker-like clarity, bright flat colours, child-friendly educational comic look.", tech: "Clean Vector Art, Thick Outlines, Flat Bright Colors, Kawaii Sticker Finish, 8K Max Resolution", base_format: "Chibi Kawaii Comic / Flashcard Poster" },
    "3d_diorama_isometric": { name: "3D Diorama", desc: "Miniature isometric toy-world aesthetic with small 3D characters or objects, rounded plastic-like forms, layered diorama base, clear depth, tidy spatial layout, and premium miniature infographic feel.", tech: "3D Isometric Diorama Render, Global Illumination, Smooth Toy Materials, Miniature Depth, 8K Max Resolution", base_format: "3D Diorama Infographic / Miniature Comic Scene" },
    "webtoon_action_halftone": { name: "Webtoon Action", desc: "Modern webtoon action comic style with bold dynamic panel angles, expressive faces, strong motion lines, halftone shadows, impact bursts, dramatic comic energy, clean digital inking, and high-contrast cel shading.", tech: "Digital Comic Ink, Bold Webtoon Linework, Cel-Shading, Halftone Texture, Speed Lines, Impact Effects, 8K Max Resolution", base_format: "Modern Webtoon Action Comic Page" },
    "semi_real_cinematic": { name: "Semi-Realistic Cinematic", desc: "Semi-realistic cinematic illustration style with believable proportions, polished digital painting, controlled facial expression, soft realistic texture, dramatic lighting, and premium movie-poster mood.", tech: "Semi-Real Digital Painting, Cinematic Lighting, Volumetric Glow, Realistic Texture Pass, 8K Max Resolution", base_format: "Semi-Realistic Cinematic Comic / Poster" },
    "anatomy_notebook": { name: "Notebook Worksheet", desc: "Educational notebook worksheet style with neat hand-drawn diagrams, grid-paper background, labelled study layout, stationery details, clean instructional visuals, and structured classroom note aesthetic.", tech: "2D Educational Illustration, Notebook Grid Overlay, Ink Diagram Lines, Stationery Props, 8K Max Resolution", base_format: "Educational Worksheet / Notebook Comic" },
    "hyperreal_3d": { name: "Hyperrealistic 3D", desc: "Ultra-detailed 3D character and object rendering with cinematic depth, realistic materials, ray-traced lighting, high texture detail, premium 3D scene composition, and strong dimensional presence.", tech: "Unreal Engine Style Render, Ray Tracing, Realistic Materials, High-Detail 3D Textures, Cinematic Depth, 8K Max Resolution", base_format: "Hyperreal 3D Cinematic Scene" },
    "kawaii_storybook": { name: "Modern Kawaii Storybook", desc: "Soft modern kawaii storybook style with gentle rounded forms, pastel palette, cute expressive faces, clean outlines, soft cel shading, friendly narrative mood, and warm storybook charm.", tech: "2D+3D Hybrid Illustration, Smooth Cel-Shading, Soft Pastel Lighting, Clean Storybook Lines, 8K Max Resolution", base_format: "Kawaii Storybook Comic Layout" },
    "pixar_3d": { name: "Pixar-Style 3D", desc: "High-quality 3D animated movie style with rounded appealing character design, expressive eyes, soft subsurface skin shading, cinematic studio lighting, polished family-animation finish, and clean emotional storytelling pose.", tech: "3D Octane-Style Render, Subsurface Scattering, Smooth Animation Materials, Cinematic Character Lighting, 8K Max Resolution", base_format: "3D Animated Movie Poster / Scene" },
    "disney_2d": { name: "Disney Traditional", desc: "Classic 2D family-animation style with expressive character acting, graceful clean linework, soft cel shading, warm storybook colour, appealing silhouettes, and polished hand-drawn animation feel.", tech: "2D Digital Painting, Clean Animation Linework, Soft Cel-Shading, Storybook Color Pass, 8K Max Resolution", base_format: "Traditional 2D Animated Storybook Comic" },
    "vector_flat": { name: "Vector Flat", desc: "Clean flat vector comic style with geometric shapes, bold simple silhouettes, crisp outlines, minimal shading, strong icon clarity, bright controlled palette, and highly readable infographic composition.", tech: "Adobe Illustrator-Style Vector Art, Flat Colors, Crisp Geometric Shapes, Minimal Shading, 8K Max Resolution", base_format: "Flat Vector Comic Infographic" },
    "watercolor": { name: "Watercolor Premium", desc: "Premium watercolour storybook comic style with soft washes, gentle ink outlines, paper texture, warm emotional tone, delicate colour bleeding, and calm illustrated storytelling mood.", tech: "Traditional Watercolor Wash, Fine Ink Linework, Paper Grain Texture, Soft Pigment Edges, 8K Max Resolution", base_format: "Watercolour Storybook Comic" },
    "rubber_hose": { name: "Vintage Rubber-Hose", desc: "Vintage 1930s rubber-hose cartoon style with bendy limbs, pie-cut eyes, simple black outlines, retro comic timing, old animation charm, limited palette, and playful classic character motion.", tech: "Vintage Animation Ink, Rubber-Hose Limbs, Retro Grain, Limited Classic Palette, 8K Max Resolution", base_format: "Vintage Rubber-Hose Comic" },
    "anime_classic": { name: "Anime Style", desc: "Clean anime and manga-inspired style with expressive eyes, sharp cel shading, crisp line art, readable emotion, dynamic yet tidy composition, and modern educational anime poster feel.", tech: "2D Anime Cel-Shading, Crisp Manga Linework, Expressive Face Detail, Clean Digital Color, 8K Max Resolution", base_format: "Anime / Manga Comic Panel" },
    "gritty_action": { name: "Gritty Action", desc: "Gritty action graphic-novel style with detailed realistic ink illustration, dramatic chiaroscuro shadows, cinematic colour palette, bold comic-panel tension, and intense thriller mood.", tech: "Detailed Ink Illustration, Dramatic Chiaroscuro Shadows, Cinematic Color Palette, Graphic Novel Panel Finish, 8K Max Resolution", base_format: "Gritty Action Graphic-Novel Comic Page" },
    "semi_real_anime": { name: "Semi-Realistic Anime", desc: "Semi-realistic anime webtoon style with refined facial proportions, polished Korean-webtoon-like digital shading, elegant linework, cinematic colour grading, expressive emotion, and mature comic-panel finish.", tech: "Modern Anime Webtoon Rendering, Semi-Real Facial Detail, Soft Digital Shading, Cinematic Color Pass, 8K Max Resolution", base_format: "Semi-Realistic Webtoon Panel" }
};

const translations = {
    bm: {
        title: "Penjana Prompt Infografik Webtoon",
        subtitle: "Jana prompt infografik pelbagai gaya kartun lengkap dengan segera.",
        labelTopic: "Topik",
        placeholderTopic: "Masukkan topik anda…",
        labelProp: "Elemen Lain / Konteks Tambahan",
        placeholderProp: "Contoh: Komputer riba, Kucing... (Anda boleh masukkan penerangan visual yang panjang di sini)",
        infoTooltipText: "Masukkan sebarang elemen tambahan, deskripsi visual terperinci, atau prop khusus untuk memperkayakan hasil prompt.",
        labelPropMode: "Mod Kandungan",
        optShort: "Ringkasan Visual & Ikon",
        optDetails: "Teks Penuh",
        labelSpanning: "Watak/Elemen Merentasi Panel",
        labelAIAdvisor: "🤖 Penasihat Gaya AI (Kesan Auto)",
        labelStyle: "Gaya Desain",
        labelArtStyle: "Gaya Seni Kartun",
        styleWarm: "Keluarga",
        styleBusiness: "Bisnes",
        styleDigital: "Digital",
        styleAcademic: "Pendidikan",
        styleExploration: "Eksplorasi",
        styleSTEM: "STEM",
        styleStorytelling: "Penceritaan",
        styleExpressive: "Ekspresif",
        styleCoretan: "Coretan",
        styleRetro: "Retro",
        styleVivid: "Vivid",
        styleMiniatur: "Miniatur",
        labelPanels: "Bilangan Panel",
        optPanelAuto: "Auto (Fleksibel)",
        optPanelPoster: "🖼️ Poster (Satu Halaman Penuh)",
        labelOutputLang: "Bahasa Output",
        labelArabicFont: "Gaya Font Arab",
        infoArabicFont: "Contoh Font Google:",
        labelCharacter: "Watak Utama",
        charFemale: "Perempuan",
        charMale: "Lelaki",
        charBoth: "Lelaki &<br>Perempuan", 
        charNone: "Tiada",       
        labelOrientation: "Saiz Paparan",
        optSize916: "📱 9:16 (Potret/TikTok/Reels/Story)",
        optSize169: "🖥️ 16:9 (Landskap/YouTube)",
        optSize11: "⬜ 1:1 (Segi Empat Sama/Instagram/FB)",
        optSize45: "🖼️ 4:5 (Potret Instagram)",
        optSizeA4: "📄 A4 Paper (2480×3508 px, 300 DPI)",
        optSizeA5: "📄 A5 Paper (1748×2480 px, 300 DPI)",
        optSizeB5: "📄 B5 Paper (2079×2953 px, 300 DPI)",
        btnGenerate: "Jana Prompt",
        outputTitle: "JANAAN PROMPT",
        jsonNote: "Format JSON memastikan model AI patuh kepada arahan secara ketat.",
        btnCopy: "SALIN PROMPT",
        btnCopied: "✓ Disalin!",
        alertCopied: "Prompt telah disalin ke papan keratan!",
        btnOpenGemini: "Buka Gemini &amp; Tampal 🚀",
        labelAsAttached: "📎 Rujuk Lampiran",
        warningText: "Ikut Fail Lampiran",
        warningSubText: "Sila muat naik fail rujukan!",
        artStyleHint: "*Gaya Kartun dinyahtaktifkan kerana ia tidak serasi dengan Gaya Desain yang dipilih.",
        footerText: "AI.WebtoonGen {year}© was creatively built and designed using Gemini Canvas by <a href='https://www.tiktok.com/@kiemiftah' target='_blank'>Kiemiftah.Com</a>.<br><span class='footer-subtext'>Last Updated on <span class='font-bold'>{date}</span> <span class='mx-1'>|</span> Hitstat: <span class='font-mono font-bold text-yellow-300'>{hits}</span></span>"
    },
    en: {
        title: "Webtoon Infographic Prompt Generator",
        subtitle: "Generate complete infographic prompts in various cartoon styles instantly.",
        labelTopic: "Topic",
        placeholderTopic: "Enter your topic...",
        labelProp: "Other Elements / Context",
        placeholderProp: "E.g., Laptop, Cat... (You can enter long visual descriptions here)",
        infoTooltipText: "Enter any additional elements, detailed visual descriptions, or specific objects to enhance the prompt.",
        labelPropMode: "Content Mode",
        optShort: "Visual Summary & Icons",
        optDetails: "Full Text",
        labelSpanning: "Character/Element Spanning Panels",
        labelAIAdvisor: "🤖 AI Style Advisor (Auto-Detect)",
        labelStyle: "Design Style",
        labelArtStyle: "Cartoon Art Style",
        styleWarm: "Family",
        styleBusiness: "Business",
        styleDigital: "Digital",
        styleAcademic: "Academic",
        styleExploration: "Exploration",
        styleSTEM: "STEM",
        styleStorytelling: "Storytelling",
        styleExpressive: "Expressive",
        styleCoretan: "Coretan",
        styleRetro: "Retro",
        styleVivid: "Vivid",
        styleMiniatur: "Miniature",
        labelPanels: "Number of Panels",
        optPanelAuto: "Auto (Flexible)",
        optPanelPoster: "🖼️ Poster (Full Single Page)",
        labelOutputLang: "Output Language",
        labelArabicFont: "Arabic Font Style",
        infoArabicFont: "Google Font Examples:",
        labelCharacter: "Main Character",
        charFemale: "Female",
        charMale: "Male",
        charBoth: "Male &<br>Female", 
        charNone: "None",   
        labelOrientation: "Display Size",
        optSize916: "📱 9:16 (Portrait/TikTok/Reels/Story)",
        optSize169: "🖥️ 16:9 (Landscape/YouTube)",
        optSize11: "⬜ 1:1 (Square/Instagram/FB Post)",
        optSize45: "🖼️ 4:5 (Instagram Portrait)",
        optSizeA4: "📄 A4 Paper (2480×3508 px, 300 DPI)",
        optSizeA5: "📄 A5 Paper (1748×2480 px, 300 DPI)",
        optSizeB5: "📄 B5 Paper (2079×2953 px, 300 DPI)",
        btnGenerate: "Generate Prompt",
        outputTitle: "GENERATED PROMPT",
        jsonNote: "JSON format ensures stricter AI compliance with complex rules.",
        btnCopy: "COPY PROMPT",
        btnCopied: "✓ Copied!",
        alertCopied: "Prompt copied to clipboard!",
        btnOpenGemini: "Open Gemini &amp; Paste 🚀",
        labelAsAttached: "📎 As Attached",
        warningText: "Follow Attached File",
        warningSubText: "Please upload a reference file!",
        artStyleHint: "*Cartoon Art Style is disabled as it is incompatible with the selected Design Style.",
        footerText: "AI.WebtoonGen {year}© was creatively built and designed using Gemini Canvas by <a href='https://www.tiktok.com/@kiemiftah' target='_blank'>Kiemiftah.Com</a>.<br><span class='footer-subtext'>Last Updated on <span class='font-bold'>{date}</span> <span class='mx-1'>|</span> Hitstat: <span class='font-mono font-bold text-yellow-300'>{hits}</span></span>"
    }
};

let currentUILang = 'bm';

function updateArtStyleCompatibility() {
    const styleChecked = document.querySelector('input[name="style"]:checked');
    if (!styleChecked) return;
    const selectedTheme = styleChecked.value;
    const artSelect = document.getElementById('art-style');
    const hint = document.getElementById('art-style-hint');
    const options = artSelect.options;
    
    const allowedStyles = styleCompatibility[selectedTheme];
    let hasEnabled = false;

    for (let i = 0; i < options.length; i++) {
        if (allowedStyles) {
            if (allowedStyles.includes(options[i].value)) {
                options[i].disabled = false;
                hasEnabled = true;
            } else {
                options[i].disabled = true;
            }
        } else {
            options[i].disabled = false;
            hasEnabled = true;
        }
    }

    if (!hasEnabled || (allowedStyles && allowedStyles.length === 0)) {
        artSelect.disabled = true;
        if(hint) hint.classList.remove('hidden');
    } else {
        artSelect.disabled = false;
        if(hint) hint.classList.add('hidden');
        if (artSelect.options[artSelect.selectedIndex].disabled) {
             for(let i = 0; i < options.length; i++){ 
                 if(!options[i].disabled) { 
                     artSelect.selectedIndex = i; 
                     break; 
                 } 
             }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const currentUrl = new URL(window.location.href);
        if (currentUrl.searchParams.has('_v')) {
            currentUrl.searchParams.delete('_v');
            const clean = currentUrl.pathname + (currentUrl.searchParams.toString() ? '?' + currentUrl.searchParams.toString() : '') + currentUrl.hash;
            window.history.replaceState({}, document.title, clean);
        }
    } catch (e) {}
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js?v=18.28').catch(err => console.log('SW failed: ', err));
        });
    }

    document.querySelectorAll('.relative-container').forEach(el => {
        el.style.position = 'relative';
    });
    
    const propModeSelect = document.getElementById('prop-mode');
    const propModeLabel = document.querySelector('label[for="prop-mode"]');
    const propSectionContainer = document.getElementById('prop-section-container');
    
    if (propModeSelect && propModeLabel && propSectionContainer) {
        propSectionContainer.appendChild(propModeLabel);
        propSectionContainer.appendChild(propModeSelect);
    }

    setUILanguage('bm');
    setupEventListeners();
    
    const updateBtn = document.getElementById('force-update-btn');
    if (updateBtn) {
        updateBtn.addEventListener('click', async () => {
            try {
                if ('serviceWorker' in navigator) {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    await Promise.all(registrations.map(r => r.unregister()));
                }
                if ('caches' in window) {
                    const keys = await caches.keys();
                    await Promise.all(keys.map(key => caches.delete(key)));
                }
                try { localStorage.clear(); } catch (e) {}
                try { sessionStorage.clear(); } catch (e) {}
                const url = new URL(window.location.href);
                url.searchParams.set('_v', Date.now());
                window.location.replace(url.toString());
            } catch (err) {
                console.error('Force update failed:', err);
                window.location.reload();
            }
        });
    }

    const installBtn = document.getElementById('install-pwa-btn');
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if(installBtn) installBtn.classList.remove('hidden');
    });

    if(installBtn) {
        installBtn.addEventListener('click', async () => {
            installBtn.classList.add('hidden');
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
            }
        });
    }

    (async () => {
        try {
            const res = await fetch("./api/hit.php?t=" + new Date().getTime(), { cache: "no-store" });
            if (!res.ok) throw new Error("API fail");
            const data = await res.json();
            globalHitCount = data.total || "0";
            updateFooter();
        } catch (e) { 
            console.log("Hitstat Error: ", e); 
            globalHitCount = "Offline";
            updateFooter();
        }
    })();
});

function updateFooter() {
    const t = translations[currentUILang];
    const footer = document.getElementById('app-footer');
    if(footer) {
        const formattedDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        
        let footerHtml = t.footerText
            .replace('{year}', currentYear)
            .replace('{date}', formattedDate)
            .replace('{hits}', globalHitCount);
        footer.innerHTML = footerHtml;
    }
}

function setUILanguage(lang) {
    currentUILang = lang;
    const t = translations[lang];
    
    document.documentElement.lang = lang;

    setText('main-title', t.title);
    setText('subtitle', t.subtitle);
    setText('label-topic', t.labelTopic);
    setPlaceholder('topic-input', t.placeholderTopic);
    setText('label-prop', t.labelProp);
    setPlaceholder('prop-input', t.placeholderProp);
    setText('info-tooltip-text', t.infoTooltipText);
    
    setText('label-prop-mode', t.labelPropMode);
    setText('opt-short', t.optShort);
    setText('opt-details', t.optDetails);
    
    setText('label-spanning', t.labelSpanning);
    setText('label-ai-advisor', t.labelAIAdvisor);
    
    setText('label-style', t.labelStyle);
    setText('label-art-style', t.labelArtStyle);
    
    setText('text-style-warm', t.styleWarm);
    setText('text-style-business', t.styleBusiness);
    setText('text-style-digital', t.styleDigital);
    setText('text-style-academic', t.styleAcademic);
    setText('text-style-exploration', t.styleExploration);
    setText('text-style-stem', t.styleSTEM);
    setText('text-style-storytelling', t.styleStorytelling);
    setText('text-style-expressive', t.styleExpressive);
    setText('text-style-coretan', t.styleCoretan);
    setText('text-style-retro', t.styleRetro);
    setText('text-style-vivid', t.styleVivid);
    setText('text-style-miniatur', t.styleMiniatur);

    setText('label-panels', t.labelPanels);
    setText('opt-panel-auto', t.optPanelAuto);
    setText('opt-panel-poster', t.optPanelPoster);
    
    setText('label-output-lang', t.labelOutputLang);
    setText('label-arabic-font', t.labelArabicFont);
    setText('info-arabic-font', t.infoArabicFont);
    
    setText('label-character', t.labelCharacter);
    setText('text-char-female', t.charFemale);
    setText('text-char-male', t.charMale);
    setHTML('text-char-both', t.charBoth);
    setText('text-char-none', t.charNone);
    
    setText('label-orientation', t.labelOrientation);
    setText('opt-size-916', t.optSize916);
    setText('opt-size-169', t.optSize169);
    setText('opt-size-11', t.optSize11);
    setText('opt-size-45', t.optSize45);
    setText('opt-size-a4', t.optSizeA4);
    setText('opt-size-a5', t.optSizeA5);
    setText('opt-size-b5', t.optSizeB5);
    
    setText('generate-btn', t.btnGenerate);
    setText('output-title', t.outputTitle);
    setText('json-note', t.jsonNote);
    setText('art-style-hint', t.artStyleHint);
    
    document.querySelectorAll('.attach-label-text').forEach(label => { label.textContent = t.labelAsAttached; });
    document.querySelectorAll('.warning-text').forEach(span => { span.textContent = t.warningText; });
    document.querySelectorAll('.warning-subtext').forEach(span => { span.textContent = t.warningSubText; });
    
    setHTML('open-gemini-btn', t.btnOpenGemini);

    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn && !copyBtn.classList.contains('copied')) { copyBtn.textContent = t.btnCopy; }

    document.querySelectorAll('.ui-lang-btn').forEach(btn => {
        if (btn.dataset.lang === lang) btn.classList.add('active');
        else btn.classList.remove('active');
    });

    updateFooter();
}

function setText(id, text) { const el = document.getElementById(id); if (el) el.textContent = text; }
function setHTML(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }
function setPlaceholder(id, text) { const el = document.getElementById(id); if (el) el.placeholder = text; }

const ARABIC_FONT_PROFILES = {
    "Almarai": { category: "clean sans", usage: "general infographic text" },
    "Amiri Quran": { category: "classical naskh", usage: "formal Arabic titles and elegant body text" },
    "Harmattan": { category: "schoolbook Arabic", usage: "educational labels and simple readable captions" },
    "IBM Plex Sans Arabic": { category: "modern sans", usage: "clean UI-like Arabic labels and structured infographics" },
    "Marhey": { category: "rounded display", usage: "friendly headers and bold callouts" },
    "Scheherazade New": { category: "traditional Arabic", usage: "bookish and manuscript-like Arabic typography" },
    "Rubik": { category: "geometric Arabic sans", usage: "modern concise labels" },
    "Tajawal": { category: "clean modern Arabic", usage: "high readability infographic captions" },
    "Beiruti": { category: "display Arabic sans", usage: "bold contemporary headings" },
    "Playpen Sans Arabic": { category: "playful handwritten Arabic", usage: "kid-friendly and informal educational content" },
    "Baloo Bhaijaan 2": { category: "rounded playful Arabic", usage: "large cheerful title treatment" }
};

function getArabicTypographyProfile(fontName) {
    const selected = ARABIC_FONT_PROFILES[fontName] || ARABIC_FONT_PROFILES['Almarai'];
    return {
        selected_font: fontName || 'Almarai',
        font_category: selected.category,
        recommended_usage: selected.usage
    };
}

function buildPromptFocusArchitecture({ panelCount, propMode, outputLanguage, isSpanning, useAI, styleAttached, artAttached, charAttached, propAttached }) {
    const hasAttachmentReference = !!(styleAttached || artAttached || charAttached || propAttached);
    const priorityOrder = [
        "Write the prompt as a clear, specific, natural-language creative brief that an image model can follow directly.",
        "State the main subject, action, setting, and intended visual message clearly.",
        "Obey attachment-based references first when attachment mode is enabled for that section.",
        hasAttachmentReference
            ? "When using references, preserve only clearly visible identity, style cues, layout cues, props, and readable details from the attachment. Change only what the user explicitly asks to change."
            : "When no attachment is active, build the image from the user topic and selected settings only.",
        "Keep one primary visual idea only. Remove decorative or narrative extras that do not strengthen the main topic.",
        "Apply design theme only to background, mood, motifs, and support environment.",
        "Apply art style only to character rendering, linework, and illustration treatment.",
        panelCount === 'poster'
            ? "Treat the composition as one poster with one clear focal hierarchy."
            : "Keep panel storytelling clear and avoid unnecessary side events or extra mini-scenes.",
        propMode === 'details'
            ? "Preserve important factual content, but condense repeated wording and remove decorative filler."
            : "Prefer icons, symbols, and short visual cues over dense written content.",
        outputLanguage === 'ar'
            ? "All visible text inside the generated artwork must stay fully in Arabic script with Arabic reading flow."
            : "Keep all visible text in the selected output language only."
    ];

    const mixingGuards = [
        "Do not merge multiple conflicting visual moods into one composition.",
        "Do not let props overpower the main topic, focal subject, or teaching message.",
        "Do not introduce random cinematic, fantasy, or decorative elements unless they directly support the topic.",
        "Do not duplicate the same idea in both text and object form unless it improves clarity.",
        "Do not render element labels or internal option labels unless the user explicitly requests them.",
        "Avoid vague prompt wording. Keep instructions concrete and specific.",
        "For visible wording, keep the text short, readable, correctly spelled, and clearly placed."
    ];

    if (useAI) mixingGuards.push("AI advisor may refine weak or empty visual support choices, but must not dilute the user's main topic.");
    if (isSpanning && panelCount !== 'poster') mixingGuards.push("Use only one dominant spanning subject unless the user explicitly asks for more.");
    if (hasAttachmentReference) mixingGuards.push("When an attachment is referenced, infer only what is clearly visible or clearly readable from that reference.");

    return {
        main_goal: "Generate one coherent infographic prompt with strict scope control and low ambiguity.",
        priority_order: priorityOrder,
        anti_mixing_rules: mixingGuards,
        prompt_quality_checks: [
            "Prompt must be specific, direct, and easy for the model to follow.",
            "Prompt must clearly separate subject, style, layout, and text instructions.",
            "Prompt must preserve selected settings and active references without inventing unnecessary extra details.",
            "Prompt must remain Shariah-compliant in all characters, props, symbols, and background details."
        ]
    };
}

function resolveStyleAndArtSelection({ useAI, manualStyle, manualArt, topic, styleAttached, artAttached, isArtStyleDisabled }) {
    const aiDecision = useAI ? aiStyleAdvisorMax(topic) : null;
    const resolvedStyle = useAI && !styleAttached && aiDecision ? aiDecision.style : manualStyle;
    const resolvedArt = useAI && !artAttached && !isArtStyleDisabled && aiDecision ? aiDecision.art : manualArt;

    return {
        finalStyle: resolvedStyle,
        finalArtKey: resolvedArt,
        aiDecision
    };
}

function buildPropInstructions({ topic, propInput, propMode, propAttached, useAI, aiDecision }) {
    const trimmedProp = (propInput || '').trim();
    const hasManualProp = trimmedProp.length > 0;
    const aiSuggestion = aiDecision?.props?.trim() || '';

    const propPayload = {
        source_mode: propAttached ? "ATTACHMENT_REFERENCE" : (useAI ? "MANUAL_PLUS_AI_SUPPORT" : (hasManualProp ? "MANUAL_ONLY" : "TOPIC_DEFAULT")),
        content_mode: propMode === 'details' ? "FULL_TEXT" : "VISUAL_SUMMARY"
    };

    if (propAttached) {
        propPayload.reference_instruction = "Deeply analyze the attached reference first. Extract only clearly visible or readable elements and integrate them naturally without copying irrelevant clutter.";
        if (hasManualProp) propPayload.manual_context = trimmedProp;
        if (useAI && aiSuggestion) propPayload.ai_support_props = aiSuggestion;
        return propPayload;
    }

    if (propMode === 'details') {
        if (hasManualProp) propPayload.manual_context = trimmedProp;
        else propPayload.default_context = `Detailed contextual support relevant to '${topic}'.`;
        if (useAI && aiSuggestion && !hasManualProp) propPayload.ai_support_props = aiSuggestion;
        if (useAI && aiSuggestion && hasManualProp) {
            propPayload.ai_support_props = aiSuggestion;
            propPayload.merge_rule = "Keep the user's manual context as primary. Use AI support props only to fill clear visual gaps.";
        }
    } else {
        if (hasManualProp) propPayload.visual_summary_target = trimmedProp;
        else propPayload.visual_summary_target = `Core visual icons and support objects relevant to '${topic}'.`;
        if (useAI && aiSuggestion) propPayload.ai_support_props = aiSuggestion;
        propPayload.merge_rule = hasManualProp
            ? "Convert the manual context into focused icons, symbols, and support visuals. Keep the main idea dominant."
            : "Use concise support icons only. Avoid overcrowding.";
    }

    return propPayload;
}

function buildArabicRules(outputLanguage, selectedArabicFont) {
    if (outputLanguage !== 'ar') return null;
    const fontProfile = getArabicTypographyProfile(selectedArabicFont);
    return {
        language_lock: "Arabic only",
        script_rule: "Use Arabic script only for all visible text inside the artwork. No Malay, no English, no Latin letters unless the user explicitly asks for them.",
        rtl_layout_rule: "All titles, captions, labels, callouts, speech bubbles, panel reading order, and visual text alignment must follow strict right-to-left flow. The reading sequence must begin from the right side.",
        typography_rule: `Prefer ${fontProfile.selected_font} as the Arabic typeface reference. Typography feel: ${fontProfile.font_category}. Best use: ${fontProfile.recommended_usage}.`,
        punctuation_rule: "Keep Arabic text shaping correct, connected, and visually balanced. Avoid broken Arabic letters, mirrored words, or mixed-direction text blocks."
    };
}

function buildImageSpecBooster(artAttached, artStyleName) {
    if (artAttached) return "CRITICAL: REFER TO ATTACHED IMAGE FOR ART STYLE.";
    return `High-clarity premium illustration. The selected art style (${artStyleName}) must be visually obvious, distinctive, and consistent across all characters, props, icons, and illustrated elements.`;
}

function buildQualityProfile() {
    return {
        target_quality: "high",
        output_resolution: "8K",
        sharpness: "high",
        readability: "high",
        clutter_control: "strict",
        upscale: true
    };
}

function buildTopicHeaderInstruction({ topic, hideTopicTitle, targetLangName, panelCount }) {
    return {
        enabled: !hideTopicTitle,
        exact_text: hideTopicTitle ? "DISABLED_BY_USER" : topic,
        role: hideTopicTitle ? "NO_TOPIC_TITLE" : "PRIMARY_HEADER_TITLE",
        placement: hideTopicTitle
            ? "No topic/title should be rendered."
            : (panelCount === 'poster'
                ? "Place the exact topic at the topmost header area of the page as the main title, above all body content."
                : "Place the exact topic at the topmost header area of the image as the main heading, clearly above the comic or infographic content."),
        hierarchy_rule: hideTopicTitle
            ? "No title hierarchy because title display is disabled by the user."
            : "The topic/title must be the first visible text element, larger and more prominent than subtitles, labels, captions, or speech bubbles.",
        readability_rule: hideTopicTitle
            ? "Not applicable."
            : `Render the topic/title in ${targetLangName}, keep it correctly spelled, easy to read, and visually separated from panels, labels, and speech bubbles.`,
        substitution_rule: hideTopicTitle
            ? "Do not create a replacement title."
            : "Do not paraphrase, shorten, replace, or omit the topic/title unless the user explicitly requests no topic/title."
    };
}

function buildTitleDesignInstruction({ topic, hideTopicTitle, panelCount, finalStyle, targetLangName }) {
    return {
        enabled: !hideTopicTitle,
        reference_intent: hideTopicTitle
            ? "No title styling needed because title display is disabled by the user."
            : "Create a prominent designed title treatment inspired by strong comic-cover / story-header styling.",
        placement: hideTopicTitle
            ? "No title placement."
            : "Place the title at the very top header area, centered or clearly dominant across the upper section.",
        visual_treatment: hideTopicTitle
            ? "Not applicable."
            : "Design the title as a bold, eye-catching header with strong hierarchy, thick readable lettering, clean outline or stroke, layered contrast, and clear separation from the background.",
        styling_direction: hideTopicTitle
            ? "Not applicable."
            : `Adapt the title styling to the selected design theme (${finalStyle.toUpperCase()}). Keep the title visually attractive and premium, but do not copy one fixed look. Let the selected design theme control the colours, accents, glow/shadow mood, and decorative feel.`,
        structure_rule: hideTopicTitle
            ? "Not applicable."
            : "If suitable, use a stacked or two-line title arrangement for stronger impact, while keeping the exact topic wording unchanged.",
        readability_rule: hideTopicTitle
            ? "Not applicable."
            : `The title must remain highly readable in ${targetLangName}, clearly separated from speech bubbles, labels, and panel content.`,
        preservation_rule: hideTopicTitle
            ? "No title to preserve."
            : `Use the exact topic text "${topic}" with no paraphrase, no shortening, and no omission.`
    };
}

function buildPromptEnhancementNotes({ outputLanguage, targetLangName, styleAttached, artAttached, charAttached, propAttached, shariahRule, dynamicComicPanels, hideTopicTitle, topic }) {
    const hasAttachmentReference = !!(styleAttached || artAttached || charAttached || propAttached);
    return {
        source_basis: "Use the attached prompting guide as a quality reference for clearer, more accurate prompt writing while preserving the app's existing style and design logic.",
        prompt_style: "Natural-language prompt with structured JSON constraints.",
        prompt_must_cover: [
            "Main subject and what is happening",
            "Setting and supporting environment",
            "Composition and visual hierarchy",
            "Selected design theme and selected art style roles",
            "Important props or supporting elements",
            "Visible text rules when text is needed",
            "Negative constraints and Shariah compliance"
        ],
        reference_handling: hasAttachmentReference
            ? [
                "Use the attachment only as a visible reference source.",
                "Preserve only clearly visible details from the attachment.",
                "Do not invent hidden or uncertain details from the attachment."
            ]
            : [
                "No attachment reference is active. Build the prompt from the user topic and selected settings."
            ],
        text_guidance: {
            language_rule: `Visible text must follow ${targetLangName} unless the user explicitly requests otherwise.`,
            wording_rule: "Keep visible wording short, exact, and easy to read.",
            arabic_rule: outputLanguage === 'ar' ? "Use correct Arabic script, connected letters, and right-to-left reading flow." : "Do not add Arabic text unless Arabic output is selected.",
            rendering_rule: "Never render JSON keys, prompt instructions, hidden notes, structural labels, or element labels as artwork text.",
            proofreading_rule: {
                bm: "Semak ejaan, tatabahasa, tanda baca, dan kelancaran ayat Bahasa Melayu. Gunakan Bahasa Melayu yang natural dan jelas.",
                en: "Check English spelling, grammar, punctuation, and natural phrasing carefully before finalizing.",
                ar: "Semak ejaan Arab, bentuk huruf bersambung, susunan kanan-ke-kiri, dan tanda baca dengan teliti sebelum final output."
            }
        },
        layout_notes: dynamicComicPanels
            ? [
                "If the comic uses more than 2 panels, make the panel design feel more modern and visually engaging.",
                "Avoid repetitive equal boxes. Use varied comic-style panel shapes or sizes while keeping reading flow clear."
            ]
            : ["Use the normal layout logic already defined by the app."],
        topic_title_rule: hideTopicTitle
            ? "Do not render the topic as a visible title because the user explicitly indicates no topic/title is needed."
            : `Use the exact topic text "${topic}" as the visible main topic/title.`,
        title_best_practice: hideTopicTitle
            ? "Title display is disabled by the user."
            : "Make the topic the topmost visible header, clearly separated from the main artwork body, and keep it as the first text users see.",
        title_visual_design_best_practice: hideTopicTitle
            ? "Title display is disabled by the user."
            : "Design the title like a strong comic/story header: bold, attractive, layered, readable, and visually integrated with the selected design theme rather than appearing as plain text.",
        preservation_rule: "Do not change the app's existing art-style logic, design-theme logic, or selected settings. Only improve prompt clarity and accuracy.",
        shariah_compliance: shariahRule
    };
}

function shouldUseDynamicComicPanels(panelCount, topic, propInput) {
    const count = parseInt(panelCount, 10);
    const combined = `${topic || ""} ${propInput || ""}`.toLowerCase();
    const mentionsThreeOrMorePanels = /(?:\b(?:3|4|5|6|7|8|9)\s*panel(?:s)?\b|\b(?:tiga|empat|lima|enam|tujuh|lapan|delapan|sembilan)\s*panel\b|\b(?:three|four|five|six|seven|eight|nine)\s*panels?\b|panel\s*(?:3|4|5|6|7|8|9)\b)/.test(combined);
    return panelCount !== 'poster' && panelCount !== '1' && ((Number.isFinite(count) && count > 2) || mentionsThreeOrMorePanels);
}

function shouldHideTopicTitle(topic, propInput) {
    const combined = `${topic || ""} ${propInput || ""}`.toLowerCase();
    return /tidak perlu topik|tak perlu topik|no topic|without topic|without title|no title/i.test(combined);
}

function buildStructuredContext(topic, propPayload) {
    return {
        topic,
        support_context: propPayload
    };
}

function setupEventListeners() {
    const langRadios = document.querySelectorAll('input[name="language"]');
    langRadios.forEach(radio => { radio.addEventListener('change', updateArabicFontVisibility); });
    updateArabicFontVisibility(); 

    document.querySelectorAll('input[name="style"]').forEach(radio => {
        radio.addEventListener('change', updateArtStyleCompatibility);
    });
    updateArtStyleCompatibility();

    const aiCheck = document.getElementById('ai-advisor-check');
    if(aiCheck) { aiCheck.addEventListener('change', toggleAIAdvisor); toggleAIAdvisor(); }

    const spanningCheck = document.getElementById('spanning-check');
    if (spanningCheck) {
        spanningCheck.addEventListener('change', toggleSpanningCustomField);
        toggleSpanningCustomField();
    }

    setupAttachedToggle('style-attached-check', 'style-warning', 'style');
    setupAttachedToggle('art-attached-check', 'art-warning', 'art');
    setupAttachedToggle('char-attached-check', 'char-warning', 'char');
    setupAttachedToggle('prop-attached-check', 'prop-warning', 'prop');

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('warning-close-btn')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('data-target');
            toggleOverlay(targetId, false);
            if(targetId === 'style-warning') { const check = document.getElementById('style-attached-check'); if(check) { check.checked = false; toggleSection('style', false); } } 
            else if(targetId === 'art-warning') { const check = document.getElementById('art-attached-check'); if(check) { check.checked = false; toggleSection('art', false); } } 
            else if(targetId === 'char-warning') { const check = document.getElementById('char-attached-check'); if(check) { check.checked = false; toggleSection('char', false); } }
            else if(targetId === 'prop-warning') { const check = document.getElementById('prop-attached-check'); if(check) { check.checked = false; toggleSection('prop', false); } }
        }
    });

    const form = document.getElementById('prompt-form');
    if(form) { form.addEventListener('submit', (e) => { e.preventDefault(); handleGenerate(); }); }

    const copyBtn = document.getElementById('copy-btn');
    if(copyBtn) { copyBtn.addEventListener('click', handleCopy); }
}

function setupAttachedToggle(checkId, overlayId, type) {
    const check = document.getElementById(checkId);
    if(check) {
        check.addEventListener('change', (e) => {
            toggleOverlay(overlayId, e.target.checked);
            toggleSection(type, e.target.checked);
        });
    }
}

function updateArabicFontVisibility() {
    const arabicRadio = document.getElementById('lang-ar');
    const fontGroup = document.getElementById('arabic-font-group');
    if (arabicRadio && fontGroup) {
        if (arabicRadio.checked) { fontGroup.classList.remove('hidden'); fontGroup.style.display = 'block'; } 
        else { fontGroup.classList.add('hidden'); fontGroup.style.display = 'none'; }
    }
}


function toggleSpanningCustomField() {
    const check = document.getElementById('spanning-check');
    const group = document.getElementById('spanning-custom-group');
    if (!check || !group) return;

    const shouldShow = !!check.checked;
    group.classList.toggle('hidden', !shouldShow);
    group.style.display = shouldShow ? 'block' : 'none';
}

function toggleAIAdvisor() {
    const aiCheck = document.getElementById('ai-advisor-check');
    const styleContainer = document.querySelectorAll('#style-section-container .format-options');
    const artContainer = document.getElementById('art-style');
    
    const styleAttachedCheck = document.getElementById('style-attached-check');
    const artAttachedCheck = document.getElementById('art-attached-check');
    const charAttachedCheck = document.getElementById('char-attached-check');
    const propAttachedCheck = document.getElementById('prop-attached-check');

    if (aiCheck && aiCheck.checked) {
        styleContainer.forEach(el => el.classList.add('disabled-section'));
        if(artContainer) artContainer.classList.add('disabled-section');
        
        if(styleAttachedCheck) { styleAttachedCheck.checked = false; toggleOverlay('style-warning', false); toggleSection('style', false); }
        if(artAttachedCheck) { artAttachedCheck.checked = false; toggleOverlay('art-warning', false); toggleSection('art', false); }
        if(charAttachedCheck) { charAttachedCheck.checked = false; toggleOverlay('char-warning', false); toggleSection('char', false); }
        if(propAttachedCheck) { propAttachedCheck.checked = false; toggleOverlay('prop-warning', false); toggleSection('prop', false); }
    } else {
        styleContainer.forEach(el => el.classList.remove('disabled-section'));
        if(artContainer) artContainer.classList.remove('disabled-section');
    }
}

function toggleOverlay(overlayId, show) {
    const overlay = document.getElementById(overlayId);
    if(overlay) { if(show) overlay.classList.remove('hidden'); else overlay.classList.add('hidden'); }
}

function toggleSection(type, isAttached) {
    let container;
    if (type === 'style') {
        const options = document.querySelectorAll('#style-section-container .format-options');
        if(isAttached) options.forEach(el => el.classList.add('section-disabled'));
        else options.forEach(el => el.classList.remove('section-disabled'));
        return;
    }
    else if (type === 'art') container = document.getElementById('art-style');
    else if (type === 'char') container = document.querySelector('#char-section-container .format-options');
    else if (type === 'prop') container = document.getElementById('prop-input'); 

    if (container) {
        if (isAttached) container.classList.add('section-disabled'); 
        else container.classList.remove('section-disabled');
    }
}

function toggleTooltip(element) {
    element.classList.toggle('active');
    document.querySelectorAll('.info-icon-wrapper').forEach(el => { if(el !== element) el.classList.remove('active'); });
}

function aiStyleAdvisorMax(topic) {
    const t = topic.toLowerCase();
    let decision = {
        style: 'warm',
        art: 'malay_chibi_25d',
        props: "Buku nota, pen, ikon idea, latar belakang ceria",
        rationale: "Fallback family-friendly educational visual support."
    };

    if (t.match(/belajar|sekolah|pendidikan|education|study|guru|cikgu|murid|universiti|college|exam/)) {
        decision = { style: 'academic', art: 'malay_chibi_25d', props: "Buku teks, papan tulis, alat tulis, beg sekolah, ikon lampu idea", rationale: "Topic signals a classroom or learning context." };
    } else if (t.match(/anatomi|anatomy|jantung|heart|organ|biologi|biology|sains hayat/)) {
        decision = { style: 'stem', art: 'anatomy_notebook', props: "Rajah anatomi berlabel, kertas grid, pen merah, nota lekat, maskot doktor chibi", rationale: "Topic needs labeled scientific structure and worksheet clarity." };
    } else if (t.match(/sains|teknologi|science|tech|komputer|cyber|siber|robot|makmal|lab|ai|coding/)) {
        decision = { style: 'stem', art: 'vector_flat', props: "Skrin hologram, litar data, mikroskop, ikon atom, robot kecil", rationale: "Topic suits structured STEM visuals with clean technical icons." };
    } else if (t.match(/bisnes|business|wang|money|kerja|pejabat|office|duit|kewangan|finance|bursa|saham/)) {
        decision = { style: 'business', art: 'disney_2d', props: "Graf naik, beg bimbit, dokumen, kalkulator, peti besi selamat", rationale: "Topic needs a corporate layout with familiar business support visuals." };
    } else if (t.match(/alam|nature|hutan|forest|kembara|travel|gunung|laut|sea|space|angkasa/)) {
        decision = { style: 'exploration', art: 'anime_classic', props: "Peta, kompas, beg galas, binokular, daun atau bintang", rationale: "Topic implies journey, landscape, or exploration mood." };
    } else if (t.match(/transport|pengangkutan|kereta|jalan|road|vehicle|map|peta/)) {
        decision = { style: 'exploration', art: '3d_diorama_isometric', props: "Jalan berliku, tanda arah, kenderaan mini, pokok kecil, awan 3D", rationale: "Topic benefits from miniature spatial explanation." };
    } else if (t.match(/motivasi|jiwa|emosi|sedih|gembira|cinta|love|family|keluarga|cerita|story/)) {
        decision = { style: 'storytelling', art: 'watercolor', props: "Buku cerita terbuka, ikon hati, awan lembut, bunga", rationale: "Topic fits narrative and emotion-led storytelling visuals." };
        if (t.match(/sedih|marah|kecewa/)) decision.style = 'expressive';
        if (t.match(/drama|filem|cinematic|movie/)) decision.art = 'semi_real_cinematic';
    } else if (t.match(/sukan|sport|bola|larian|run|athlete|atlet|aksi|action|lawan|fight/)) {
        decision = { style: 'storytelling', art: 'webtoon_action_halftone', props: "Speed lines, kesan impak, peluh, kasut sukan, piala", rationale: "Topic needs motion-heavy action emphasis." };
    } else if (t.match(/kanak|kids|permainan|fun|kartun|flashcard|kad imbas/)) {
        decision = { style: 'coretan', art: 'chibi_kawaii_vector', props: "Sticker label, bintang, awan comel, lencana, mainan", rationale: "Topic suits simple playful educational visuals." };
    } else if (t.match(/game|permainan|movie|filem|epik|epic|cinematic|action|aksi/)) {
        decision = { style: 'vivid', art: 'hyperreal_3d', props: "Pencahayaan dinamik, tekstur terperinci, latar sinematik", rationale: "Topic signals high-energy cinematic presentation." };
    }

    return decision;
}


function getArtStyleData(finalStyle, finalArtKey, isArtStyleDisabled, artAttached, useAI) {
    if (isArtStyleDisabled) {
        if (finalStyle === 'coretan') {
            return { 
                name: "HAND-DRAWN DOODLE STYLE", 
                desc: "Strictly render the characters and all elements in a sketchy, hand-drawn doodle format with scratchy lines and playful proportions.", 
                tech: "Rough Sketch, Ink Doodle, Minimal Coloring", 
                base_format: "Doodle Illustration" 
            };
        } else {
            return { 
                name: "NEUTRAL / ADAPTIVE RENDERING", 
                desc: "Do not force a specific character style. Let the rendering naturally adapt to the background design theme.", 
                tech: "Adaptive", 
                base_format: "Standard Illustration" 
            };
        }
    } 
    
    if (artAttached) {
        return { name: "AS_ATTACHED_REFERENCE", desc: "Strictly mimic attached image style.", tech: "Image-to-Image", base_format: "Custom" };
    } 
    
    if (useAI && !artAttached) {
        return { name: "AI_AUTO_SELECTION", desc: "AI Selected Style", tech: "Model-Driven", base_format: "Auto" };
    }
    
    return artStylesMap[finalArtKey] || { name: finalArtKey, desc: "Standard", tech: "Standard", base_format: "Standard" };
}

function buildCharacterDescription(character, isIslamicContext, charAttached, artStyleName, shariahRule) {
    if (charAttached) {
        return "AS_ATTACHED_REFERENCE: Strictly mimic the character.";
    }

    // PENAMBAHBAIKAN: Lelaki tiada kopiah secara lalai (Kecuali konteks Islamik).
    let maleAttireDesc = isIslamicContext 
        ? "wearing modest loose clothing, long pants, and a kopiah (Islamic skullcap)"
        : "wearing modern modest casual clothing, long pants. CRITICAL: The male character MUST have a modern bareheaded hairstyle. ABSOLUTELY NO kopiah, NO skullcap, NO songkok, and NO religious headwear.";

    let charBaseDesc = "";
    if (character === 'male') {
        charBaseDesc = `[LOCKED ATTIRE] Young Malaysian boy, ${maleAttireDesc}.`;
    } else if (character === 'female') {
        charBaseDesc = "[LOCKED ATTIRE] Young Malaysian girl, wearing a proper loose hijab completely covering hair/neck, long sleeves, loose and modest clothing.";
    } else if (character === 'both') {
        charBaseDesc = `[LOCKED ATTIRE] One young Malaysian boy (${maleAttireDesc}) and one young Malaysian girl (proper loose hijab completely covering hair, long sleeves, loose modest clothing).`;
    } else {
        charBaseDesc = "No human characters. Focus on icons/objects.";
    }

    return `${charBaseDesc} Designed in ${artStyleName} style. ${shariahRule}`;
}

function getDynamicNegatives(isIslamicContext, character, shariahRule) {
    const negatives = [
        "NO structural labels such as panel numbering inside the image",
        "NO instructional text or prompt metadata rendered as artwork text",
        "NO element labels or option labels rendered as artwork text",
        "NO random floating names or unrelated decorative words",
        "NO blur",
        "NO pixelation",
        "NO cluttered duplicate props",
        "NO irrelevant side scenes that distract from the main topic",
        "NO piggy bank",
        "NO pig or boar forms",
        "NO pork",
        "NO alcohol",
        "NO gambling symbols",
        "NO cross signs",
        "NO idols or statues",
        "NO non-halal symbols",
        "NO exposed aurat",
        "NO tight or revealing clothing",
        "NO form-fitting clothes",
        "NO short sleeves",
        "NO shorts",
        "NO skirts above ankle",
        "NO exposed hair on female",
        shariahRule
    ];

    if (!isIslamicContext && (character === 'male' || character === 'both')) {
        negatives.push("NO kopiah", "NO skullcap", "NO traditional religious headwear on male", "NO songkok", "NO turban");
    }

    return negatives;
}

function getSeparationRules(isArtStyleDisabled, finalStyle) {
    let rules = [
        "Apply the selected design theme to background colors, atmosphere, decorative motifs, support elements, and panel/environment styling.",
        "Ensure the generated image includes the FULL theme properties (palette, mood, and theme-specific background elements), not just color changes."
    ];
    
    if (isArtStyleDisabled) {
        if (finalStyle === 'coretan') {
            rules.push("CRITICAL: The ENTIRE image, including CHARACTERS, MUST be drawn in the playful, hand-drawn doodle/sketch style.");
        } else {
            rules.push("Adapt character style to match the background theme naturally without forcing a specific detailed cartoon render.");
        }
    } else {
        rules.push("Apply the selected cartoon art style STRICTLY to character design, linework, shading, proportions, expressions, and rendering treatment only.");
        rules.push("Make the selected cartoon art style visibly distinctive, not generic. The difference between art styles must be clear in the final image.");
    }
    
    rules.push("CRITICAL: Do NOT use the design theme to change or override character rendering style or identity.");
    return rules;
}

function handleGenerate() {
    try {
        const topicEl = document.getElementById('topic-input');
        if (!topicEl) throw new Error('topic-input not found');
        const topic = topicEl.value.trim();
        if (!topic) return;

        const propEl = document.getElementById('prop-input');
        const propInput = propEl ? propEl.value.trim() : '';
        const outputLanguage = document.querySelector('input[name="language"]:checked')?.value || 'bm';
        const selectedArabicFont = document.getElementById('arabic-font')?.value || 'Almarai';
        const character = document.querySelector('input[name="character"]:checked')?.value || 'female';
        const sizeSelect = document.getElementById('size-select')?.value || '9:16';
        const panelCount = document.getElementById('panel-count')?.value || 'auto';
        const propMode = document.getElementById('prop-mode')?.value || 'short';
        const isSpanning = document.getElementById('spanning-check')?.checked || false;
        const spanningCustomInput = document.getElementById('spanning-custom-input')?.value?.trim() || '';
        const propAttached = document.getElementById('prop-attached-check')?.checked || false;
        const styleAttached = document.getElementById('style-attached-check')?.checked || false;
        const artAttached = document.getElementById('art-attached-check')?.checked || false;
        const charAttached = document.getElementById('char-attached-check')?.checked || false;

        const artStyleEl = document.getElementById('art-style');
        const isArtStyleDisabled = !!artStyleEl?.disabled;
        const manualStyle = document.querySelector('input[name="style"]:checked')?.value || 'warm';
        const manualArt = artStyleEl?.value || 'default';
        const useAI = document.getElementById('ai-advisor-check')?.checked || false;

        const combinedContext = (topic + " " + propInput).toLowerCase();
        const dynamicComicPanels = shouldUseDynamicComicPanels(panelCount, topic, propInput);
        const hideTopicTitle = shouldHideTopicTitle(topic, propInput);
        const isIslamicContext = combinedContext.match(/dakwah|tazkirah|islam|agama|solat|masjid|ustaz|puasa|ramadan|doa|quran|sunnah|syariah|zikir|ceramah|halal/);

        const themes = {
            business: {
                palette: "Deep Navy Blue, Slate Grey, Crisp White, Metallic Gold Accents",
                atmosphere: "Professional, Sleek, Clean Corporate, Modern Studio Lighting",
                elements: ["Subtle Geometric Grids", "Abstract Data Lines", "Clean Glass Textures"]
            },
            digital: {
                palette: "Deep Void Black, Neon Cyan, Electric Purple, Data White",
                atmosphere: "Cyberpunk, Virtual Reality, High Contrast, Glowing Nodes",
                elements: ["Digital Circuit Patterns", "Holographic Overlays", "Binary Code Textures"]
            },
            academic: {
                palette: "Blackboard Green, Chalk White, Oak Wood Brown, Soft Primary Accents",
                atmosphere: "Focused, Structured, Bright Educational Environment, Crisp Lighting",
                elements: ["Notebook Paper Textures", "Subtle Grid Backgrounds", "Clean Informational Frames"]
            },
            exploration: {
                palette: "Forest Green, Earthy Brown, Azure Sky Blue, Golden Hour Yellow",
                atmosphere: "Expansive, Natural, Fresh Air, Golden Sunlight",
                elements: ["Topographic Line Patterns", "Organic Textures", "Subtle Compass Rose Motifs"]
            },
            stem: {
                palette: "Clinical Lab White, Tech Blue, Safety Orange, Bio-Luminescent Green",
                atmosphere: "Analytical, Sterile, High-Tech, Cool Laboratory Lighting",
                elements: ["Hexagonal Molecule Grids", "Abstract Blueprint Overlays", "Technical Line Art"]
            },
            storytelling: {
                palette: "Soft Pastels, Dreamy Pink, Sky Blue, Warm Ink Outlines",
                atmosphere: "Imaginative, Whimsical, Gentle, Storybook Magic",
                elements: ["Dreamlike Gradients", "Soft Magical Sparkles", "Layered Scene Borders"]
            },
            expressive: {
                palette: "High Contrast Black & White, Urgent Red, Impact Yellow",
                atmosphere: "Dynamic, Intense, High Energy, Dramatic Shadows",
                elements: ["Halftone Dot Textures", "Dynamic Speed Lines", "Abstract Burst Backgrounds"]
            },
            warm: {
                palette: "Warm Peach, Soft Cream, Buttery Yellow, Muted Wood Tones",
                atmosphere: "Cozy, Nostalgic, Gentle Morning Sunlight, Soft Focus",
                elements: ["Subtle Floral Motifs", "Warm Light Leaks", "Soft Rounded Background Panels"]
            },
            coretan: {
                palette: "Monochrome or limited playful colors, ink black, paper white, marker accents",
                atmosphere: "Playful, sketchy, messy but creative, hand-drawn scratchy vibe",
                elements: ["Rough sketch lines", "Hand-drawn doodle motifs", "Scratchy shading", "Paper texture", "Irregular borders"]
            },
            retro: {
                palette: "Retro 8-bit game colors, classic console hues, vibrant red, pixel blue, dark void backgrounds",
                atmosphere: "Nostalgic, playful, arcade-era, 8-bit pixel game vibe",
                elements: ["Pixel blocks", "8-bit background patterns", "Retro game HUD frames", "Scanline overlays"]
            },
            vivid: {
                palette: "Bright high-contrast color system, vivid accents, luminous highlights, deep support tones, clean light-dark separation",
                atmosphere: "Sharp, polished, energetic, high-clarity, modern, attention-grabbing",
                elements: ["Glowing interface lines", "Sharp geometric frames", "HUD overlay panels", "Luminous particles", "Neon edge accents", "Crisp grid patterns", "Light streaks", "Clean tech overlays"]
            },
            miniatur: {
                palette: "Clean environmental tones, natural surface colors, structured accent highlights, bright readable contrast",
                atmosphere: "Structured, informative, clean, detailed, premium, miniature showcase",
                elements: ["Isometric land blocks", "Miniature buildings", "Layered terrain cutaway", "Water channels", "Tiny infrastructure details", "Clean diorama base", "Micro landscape elements", "Structured environmental zones"]
            }
        };

        const selection = resolveStyleAndArtSelection({
            useAI,
            manualStyle,
            manualArt,
            topic,
            styleAttached,
            artAttached,
            isArtStyleDisabled
        });

        const finalStyle = selection.finalStyle;
        const finalArtKey = selection.finalArtKey;
        const aiDecision = selection.aiDecision;
        const propPayload = buildPropInstructions({
            topic,
            propInput,
            propMode,
            propAttached,
            useAI,
            aiDecision
        });

        let dimensionStr = "";
        let aspectRatioStr = sizeSelect;
        if (sizeSelect === '9:16') dimensionStr = "1080x1920 (9:16 Vertical)";
        else if (sizeSelect === '16:9') dimensionStr = "1920x1080 (16:9 Landscape)";
        else if (sizeSelect === '1:1') dimensionStr = "1080x1080 (1:1 Square)";
        else if (sizeSelect === '4:5') dimensionStr = "1080x1350 (4:5 Portrait)";
        else if (sizeSelect === 'A4') {
            dimensionStr = "2480x3508 (A4 Portrait, 300 DPI)";
            aspectRatioStr = "1000:1414";
        }
        else if (sizeSelect === 'A5') {
            dimensionStr = "1748x2480 (A5 Portrait, 300 DPI)";
            aspectRatioStr = "1000:1414";
        }
        else if (sizeSelect === 'B5') {
            dimensionStr = "2079x2953 (B5 Portrait, 300 DPI)";
            aspectRatioStr = "176:250";
        }
        else {
            dimensionStr = "1080x1920 (9:16 Vertical)";
            aspectRatioStr = "9:16";
        }

        const shariahRule = "STRICT TOTAL SHARIAH COMPLIANCE: All characters, including background characters, must be modestly dressed. Female characters must wear a proper hijab fully covering hair, ears, and neck. Clothing must be loose-fitting and non-transparent with long sleeves and long pants or skirts. All props, objects, and symbols must be halal and Shariah-compliant. No forbidden elements such as pigs, piggy banks, alcohol, gambling, idols, or cross signs.";

        const artStyleData = getArtStyleData(finalStyle, finalArtKey, isArtStyleDisabled, artAttached, useAI);
        let selectedTheme = themes[finalStyle] || themes['warm'];
        if (styleAttached) {
            selectedTheme = { palette: "Refer to attachment", atmosphere: "Refer to attachment", elements: ["Refer to attachment"] };
        }

        const finalCharDesc = buildCharacterDescription(character, isIslamicContext, charAttached, artStyleData.name, shariahRule);
        const charDetails = { type: character === 'none' ? "None" : "Character", description: finalCharDesc };

        let layoutFlow = "Logical narrative progression with modern flexible framing. Keep hierarchy clear, spacing controlled, and panel reading order easy to follow. Avoid rigid empty grids unless they improve clarity.";
        let structure = panelCount === 'auto'
            ? "Modern and flexible dynamic fluid layout"
            : `Modern and flexible ${panelCount}-panel layout`;

        const specialVisualEffects = [];
        if (panelCount === '1') {
            structure = "1 single panel";
            layoutFlow = "Standard single panel composition with one clear focal hierarchy.";
        } else if (panelCount === 'poster') {
            structure = "Single sheet poster with no panel dividers";
            layoutFlow = "Unified poster composition with one clear focal point, clean information hierarchy, and disciplined spacing.";
        } else if (dynamicComicPanels) {
            structure = `Modern dynamic ${panelCount === 'auto' ? 'multi' : panelCount}-panel comic layout`;
            layoutFlow = "Modern comic-style panel flow with varied panel sizes or shapes, dynamic composition, and clear reading order. Avoid repetitive equal boxes while preserving story clarity.";
        }

        const arabicRules = buildArabicRules(outputLanguage, selectedArabicFont);
        if (arabicRules) {
            layoutFlow += " Strict right-to-left reading order. Start visual reading flow from the right side.";
        }

        if (isSpanning && panelCount !== 'poster') {
            specialVisualEffects.push("At least one major subject or element must visibly span across a minimum of 2 panels with clear overlap, central placement, and depth continuity.");
            specialVisualEffects.push("Use only one dominant spanning element unless the user explicitly requests more.");
            specialVisualEffects.push(
                spanningCustomInput
                    ? `User-defined spanning instruction: ${spanningCustomInput}`
                    : "If the user does not specify the spanning subject, automatically choose the most suitable character or prop and place it centrally across the panels without disrupting story flow."
            );
        }

        const targetLangName = outputLanguage === 'ar' ? "Arabic" : (outputLanguage === 'bm' ? "Malay" : "English");
        const dynamicNegatives = getDynamicNegatives(isIslamicContext, character, shariahRule);
        const separationRules = getSeparationRules(isArtStyleDisabled, finalStyle);
        const promptArchitecture = buildPromptFocusArchitecture({
            panelCount,
            propMode,
            outputLanguage,
            isSpanning,
            useAI,
            styleAttached,
            artAttached,
            charAttached,
            propAttached
        });

        const promptJson = {
            _directive: "GENERATE_IMAGE",
            meta: {
                target_model: "DALL-E 3 / Gemini Imagen",
                priority: "High Accuracy",
                style_reference_instructions: {
                    design_style: styleAttached ? "AS_ATTACHED_REFERENCE" : (useAI ? "AI_AUTO" : "MANUAL"),
                    art_style: artAttached ? "AS_ATTACHED_REFERENCE" : (useAI ? "AI_AUTO" : "MANUAL"),
                    character_design: charAttached ? "AS_ATTACHED_REFERENCE" : (useAI ? "AI_AUTO" : "MANUAL")
                },
                ai_advisor_mode: useAI ? "ACTIVE" : "MANUAL",
                ai_advisor_resolution: useAI ? {
                    behavior: "AI advisor is active. It may refine or choose the most suitable style direction based on the topic, learning context, mood, and target audience, but only when no attachment overrides that section and no explicit user instruction conflicts with it.",
                    selected_style: finalStyle,
                    selected_art_style: finalArtKey,
                    background_theme_behavior: "AI may also infer the most suitable background/theme direction from the topic when manual background details are not explicitly provided.",
                    override_priority: "Follow attachment references first. Follow explicit user instructions in topic/element/context before AI-generated refinements.",
                    rationale: aiDecision?.rationale || "No special rationale"
                } : {
                    behavior: "Manual user settings preserved.",
                    selected_style: finalStyle,
                    selected_art_style: finalArtKey
                }
            },
            background_theme_logic: useAI ? {
                mode: "AUTO_BASED_ON_TOPIC_UNLESS_MANUAL_STYLE_SELECTED",
                instruction: "Generate the most suitable background theme based on the topic, learning context, mood, and target audience.",
                override_rule: "If the user specifies background, setting, or visual elements in the element/context field, follow that instruction first.",
                attachment_rule: styleAttached ? "If a style/design attachment is active, follow the attachment for background/theme cues first." : "No style/design attachment is active.",
                ai_scope_rule: "Use AI-generated background/theme direction only to support the topic. Do not weaken explicit manual instructions."
            } : {
                mode: "MANUAL_OR_SELECTED_STYLE",
                instruction: "Use the manually selected style/design background logic.",
                override_rule: "If the user specifies background, setting, or visual elements in the element/context field, follow that instruction first."
            },
            prompt_focus_architecture: promptArchitecture,
            prompt_enhancement_notes: buildPromptEnhancementNotes({
                outputLanguage,
                targetLangName,
                styleAttached,
                artAttached,
                charAttached,
                propAttached,
                shariahRule,
                dynamicComicPanels,
                hideTopicTitle,
                topic
            }),
            title_header_instruction: buildTopicHeaderInstruction({
                topic,
                hideTopicTitle,
                targetLangName,
                panelCount
            }),
            title_design_instruction: buildTitleDesignInstruction({
                topic,
                hideTopicTitle,
                panelCount,
                finalStyle,
                targetLangName
            }),
            visible_text_requirements: {
                main_topic_required: !hideTopicTitle,
                main_topic_exact_text: hideTopicTitle ? "DISABLED_BY_USER" : topic,
                main_topic_instruction: hideTopicTitle
                    ? "Do not display a topic/title in the final image."
                    : "The final image must include the exact topic from the topic field as the main visible title or topic heading.",
                main_topic_position: hideTopicTitle ? "DISABLED" : "TOP HEADER / TOPMOST TITLE AREA",
                title_hierarchy_rule: hideTopicTitle
                    ? "No title hierarchy because title display is disabled by the user."
                    : "The topic/title must be the first visible text, larger and more prominent than any subtitle, label, caption, or speech bubble.",
                exact_text_preservation_rule: hideTopicTitle
                    ? "Do not display the topic/title."
                    : "Use the exact topic text from the topic field. Do not paraphrase, shorten, replace, or omit it.",
                title_design_rule: hideTopicTitle
                    ? "No title design because title display is disabled."
                    : "Render the topic/title as a designed comic-style story header, not as plain default text. Keep it attractive, bold, and integrated with the selected design theme.",
                text_language: targetLangName,
                readability_rule: "Keep the topic/title readable, correctly spelled, and visually separated from speech bubbles or labels."
            },
            image_specifications: {
                format: panelCount === 'poster' ? "Educational Poster" : "Webtoon Infographic",
                aspect_ratio: aspectRatioStr,
                dimensions: dimensionStr,
                style_booster: buildImageSpecBooster(artAttached, artStyleData.name),
                art_style: artStyleData.name,
                rendering_technique: artStyleData.tech,
                visual_emphasis: artStyleData.desc,
                art_style_distinctiveness_rule: "Make the chosen art style clearly noticeable. Do not produce a generic cartoon look when a specific art style is selected.",
                quality_profile: buildQualityProfile()
            },
            core_content: {
                ...buildStructuredContext(topic, propPayload),
                main_characters: charDetails
            },
            visual_style: {
                design_theme_background: finalStyle.toUpperCase(),
                title_theme_integration: hideTopicTitle
                    ? "No title integration because title display is disabled."
                    : "The title/header design must visually match the selected design theme through suitable colour choices, accents, glow/shadow feel, and decorative treatment.",
                color_palette: selectedTheme.palette,
                environmental_atmosphere: selectedTheme.atmosphere,
                theme_specific_background_motifs: selectedTheme.elements,
                optional_background_accents: "Subtle support accents may be added only when they improve clarity and do not clutter the subject."
            },
            style_separation_rules: separationRules,
            text_processing_rules: {
                target_language: outputLanguage,
                translation_instruction: `Translate all user inputs into ${targetLangName} for the final visible output language when text is needed inside the artwork.`,
                typography_constraint: "Do not render structural labels such as panel numbering, JSON labels, prompt instructions, hidden notes, metadata, or element labels as visible artwork text.",
                text_accuracy_constraint: "Visible text must be short, exact, correctly spelled, readable, and placed clearly. Do not add extra slogans or decorative wording unless requested.",
                topic_display_rule: hideTopicTitle ? "Do not display the topic/title in the final image." : `MUST display the exact topic/title from the topic input as the topmost visible main heading/header: ${topic}`,
                topic_rendering_priority: hideTopicTitle
                    ? "Title rendering is disabled by the user."
                    : "Treat the topic/title as a mandatory high-priority header. It must appear at the top before body content, panel content, captions, or labels.",
                multilingual_proofreading_rule: {
                    bm: "Semak ejaan, tatabahasa, tanda baca, dan kelancaran Bahasa Melayu dengan ketat.",
                    en: "Check English spelling, grammar, punctuation, and natural wording strictly.",
                    ar: "Semak ejaan Arab, huruf bersambung, susunan kanan-ke-kiri, dan tanda baca secara ketat."
                },
                arabic_output_rules: arabicRules
            },
            layout_configuration: {
                structure,
                flow: layoutFlow,
                header_title_zone: hideTopicTitle
                    ? "No top header title zone because the user requested no topic/title."
                    : "Reserve a clear top header zone for the exact topic/title. This title zone must appear above the main content and must not be merged into speech bubbles, captions, or panel labels.",
                header_title_design_rule: hideTopicTitle
                    ? "No title design rule because title display is disabled."
                    : "Design the header title with strong comic-story visual treatment: bold typography, clean stroke or outline, attractive layered contrast, and clear visual separation from the background, while still following the selected design theme.",
                panel_design_rule: dynamicComicPanels
                    ? "For comics with more than 2 panels, use a more interesting modern comic-style layout: varied panel sizes, dynamic framing, diagonal or staggered panel rhythm where suitable, clear gutters, and strong reading flow. Avoid repetitive identical box panels."
                    : "Use the normal panel design logic.",
                special_visual_effects: specialVisualEffects.length > 0 ? specialVisualEffects : ["Standard composition"],
                spanning_panel_behavior: isSpanning && panelCount !== 'poster'
                    ? {
                        enabled: true,
                        minimum_panel_span: 2,
                        mode: spanningCustomInput ? "USER_DEFINED" : "AI_AUTO",
                        user_instruction_optional: spanningCustomInput || "AUTO",
                        auto_subject_rule: spanningCustomInput ? "Follow user instruction." : "Automatically choose a suitable character or prop from the topic/context and place it visibly across the center panel boundary. It must be large enough to be noticed, integrated with depth, and must not block the story flow or main text."
                    }
                    : { enabled: false }
            },
            negative_constraints: dynamicNegatives
        };

        const outputSection = document.getElementById('output-section');
        const promptOutput = document.getElementById('prompt-output');
        if (!outputSection || !promptOutput) throw new Error('output section not found');

        promptOutput.textContent = JSON.stringify(promptJson, null, 2);
        promptOutput.classList.remove('rtl');
        promptOutput.style.direction = 'ltr';
        promptOutput.style.textAlign = 'left';

        outputSection.classList.add('show');
        if (typeof outputSection.scrollIntoView === 'function') {
            outputSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    } catch (err) {
        console.error('Generate prompt failed:', err);
        alert('Jana Prompt gagal. Sila semak Console (F12) untuk ralat.');
    }
}

function handleCopy() {
    const promptText = document.getElementById('prompt-output').textContent;
    navigator.clipboard.writeText(promptText).then(() => {
        const btn = document.getElementById('copy-btn');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = "✓ Disalin!";
            btn.classList.add('copied');
            setTimeout(() => { btn.textContent = originalText; btn.classList.remove('copied'); }, 2000);
        }
    });
}
