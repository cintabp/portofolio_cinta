let currentLanguage = "id";
const readPreference = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch {} };

const projects = {
  bmkg:{id:{eyebrow:"PENGALAMAN PROFESIONAL · 2026",title:"Website BMKG Minangkabau",body:"Selama magang di Stasiun Meteorologi Minangkabau, saya terlibat dalam pengembangan dan pemeliharaan website instansi.",items:["Memperbarui tampilan halaman dan konten informasi.","Menguji fungsionalitas website.","Berkoordinasi dengan tim IT mengenai kebutuhan pengembangan dan perbaikan."],note:"Fokus: pengembangan web, pengujian, dan kolaborasi tim."},en:{eyebrow:"PROFESSIONAL EXPERIENCE · 2026",title:"BMKG Minangkabau Website",body:"During my internship at the Minangkabau Meteorological Station, BMKG, I contributed to the development and maintenance of the agency website.",items:["Updated page layouts and information content.","Tested website functionality.","Coordinated with the IT team on development and improvement needs."],note:"Focus: web development, testing, and teamwork."}},
  ekskul:{id:{eyebrow:"PROYEK WEBSITE",title:"Website Ekskul",body:"Website ekstrakurikuler sekolah dengan antarmuka dinamis dan responsif.",items:["Proyek website untuk kegiatan ekstrakurikuler."],note:""},en:{eyebrow:"WEBSITE PROJECT",title:"Extracurricular Website",body:"A school extracurricular website with a dynamic, responsive interface.",items:["A website project for extracurricular activities."],note:""}},
  mytelkomsel:{id:{eyebrow:"TUGAS DESAIN KULIAH",title:"Desain aplikasi MyTelkomsel",body:"Desain antarmuka untuk tugas kuliah yang terinspirasi dari aplikasi MyTelkomsel.",items:["Latihan desain antarmuka mobile sebagai bagian dari tugas perkuliahan."],note:"Ini bukan proyek resmi atau afiliasi dengan Telkomsel."},en:{eyebrow:"COURSE DESIGN ASSIGNMENT",title:"MyTelkomsel App Design",body:"A coursework interface design inspired by the MyTelkomsel application.",items:["A mobile interface design exercise completed as coursework."],note:"This is not an official Telkomsel project or affiliation."}},
  ar:{id:{eyebrow:"PUBLIKASI ARTIKEL ILMIAH · 2026",title:"Media Pembelajaran AR",body:"Media pembelajaran hardware komputer dengan visualisasi komponen 3D dan gamifikasi untuk siswa SMK TKJ.",items:["Validitas media 91,25%.","Validitas materi 93,81%.","Kepraktisan 94%."],note:"Dikembangkan sebagai proyek akademik dan dipublikasikan sebagai artikel ilmiah pada 2026."},en:{eyebrow:"RESEARCH PUBLICATION · 2026",title:"AR Learning Media",body:"Computer hardware learning media with 3D component visualizations and gamification for vocational IT students.",items:["Media validity: 91.25%.","Content validity: 93.81%.","Practicality: 94%."],note:"Developed as an academic project and published as a research article in 2026."}},
  littlesteps:{id:{eyebrow:"PROYEK APLIKASI",title:"Little Steps",body:"Aplikasi Little Steps yang saya kerjakan sebagai proyek.",items:[],note:""},en:{eyebrow:"APPLICATION PROJECT",title:"Little Steps",body:"The Little Steps application I worked on as a project.",items:[],note:""}},
  smarthome:{id:{eyebrow:"PROYEK INTERNET OF THINGS",title:"Aplikasi Smart Home IoT",body:"Proyek aplikasi smart home yang saya kerjakan dengan teknologi IoT.",items:[],note:""},en:{eyebrow:"INTERNET OF THINGS PROJECT",title:"Smart Home IoT Application",body:"A smart home application project I worked on using IoT technology.",items:[],note:""}}
};

// Show only real local images. If a named image is absent, the designed background remains visible.
function prepareImage(img) {
  const reveal = () => {
    const ok = img.complete && img.naturalWidth > 0;
    img.classList.toggle("image-loaded", ok);
    img.classList.toggle("image-missing", !ok);
    img.parentElement?.classList.toggle("image-ready", ok);
  };
  img.addEventListener("load", reveal);
  img.addEventListener("error", reveal);
  if (img.complete) reveal();
}
document.querySelectorAll("#profilePhoto, .local-project-image, .local-experience-image, .local-education-image, .local-cert-image").forEach(prepareImage);
document.querySelectorAll(".brand-logo").forEach((img) => img.addEventListener("error", () => img.closest(".tech-mark")?.classList.add("logo-failed")));

// Theme preference
const themeButton = document.querySelector("#themeToggle");
function applyTheme(theme) {
  if (!themeButton) return;
  document.documentElement.dataset.theme = theme;
  const dark = theme === "dark";
  themeButton.setAttribute("aria-pressed", String(dark));
  themeButton.querySelector(".theme-icon").textContent = dark ? "☀" : "☾";
  themeButton.querySelector(".theme-word").textContent = currentLanguage === "en" ? (dark ? "Light mode" : "Dark mode") : (dark ? "Mode terang" : "Mode gelap");
  themeButton.setAttribute("aria-label", currentLanguage === "en" ? (dark ? "Enable light mode" : "Enable dark mode") : (dark ? "Aktifkan mode terang" : "Aktifkan mode gelap"));
  document.querySelector('meta[name="theme-color"]').content = dark ? "#111a27" : "#f4f7fb";
}
applyTheme(readPreference("cinta-portfolio-theme") === "dark" ? "dark" : "light");
themeButton?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next); savePreference("cinta-portfolio-theme", next);
});

// Reusable image-and-copy detail modal, used by both project and credential cards.
const detailModal = document.querySelector("#projectModal");
function openDetail({ eyebrow, title, body, items = [], note = "", imageSrc, imageAlt, gallery = [] }) {
  detailModal.querySelector("#modalEyebrow").textContent = eyebrow || (currentLanguage === "en" ? "DETAIL" : "DETAIL");
  detailModal.querySelector("#modalTitle").textContent = title;
  const content = detailModal.querySelector("#modalContent");
  content.replaceChildren();
  if (imageSrc) {
    const image = document.createElement("img");
    image.className = "modal-preview";
    image.src = imageSrc; image.alt = imageAlt || title;
    image.addEventListener("error", () => image.classList.add("image-missing"));
    content.append(image);
  }
  if (gallery.length) {
    const grid = document.createElement("div"); grid.className = "modal-gallery";
    gallery.forEach(({ src, alt, caption }) => {
      const figure = document.createElement("figure"), image = document.createElement("img"), figcaption = document.createElement("figcaption");
      image.src = src; image.alt = alt || caption || title; image.loading = "lazy";
      image.addEventListener("error", () => figure.remove());
      figcaption.textContent = caption || ""; figure.append(image, figcaption); grid.append(figure);
    });
    content.append(grid);
  }
  const p = document.createElement("p"); p.textContent = body || ""; content.append(p);
  if (items.length) {
    const list = document.createElement("ul");
    items.forEach((item) => { const li = document.createElement("li"); li.textContent = item; list.append(li); });
    content.append(list);
  }
  if (note) { const noteNode = document.createElement("p"); const strong = document.createElement("strong"); strong.textContent = note; noteNode.append(strong); content.append(noteNode); }
  detailModal.classList.add("open");
  detailModal.querySelector(".modal-close").focus();
}
document.querySelectorAll(".project-card .detail-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projects[button.dataset.project]?.[currentLanguage];
    if (!project) return;
    const card = button.closest(".project-card"), image = card.querySelector(".local-project-image");
    openDetail({ ...project, imageSrc: image?.getAttribute("src"), imageAlt: image?.alt || project.title });
  });
});
document.querySelectorAll(".cert-card .cert-detail-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const card=button.closest(".cert-card"), image=card.querySelector(".local-cert-image");
    const title=card.querySelector(".cert-title")?.textContent.trim() || "";
    const issuer=card.querySelector(".cert-bottom")?.children[0]?.textContent.trim() || "";
    const date=card.querySelector(".cert-bottom")?.children[1]?.textContent.trim() || "";
    openDetail({eyebrow:currentLanguage==="en"?"CERTIFICATE / TRAINING":"SERTIFIKAT / PELATIHAN",title,body:[issuer,date].filter(Boolean).join(" · "),imageSrc:image?.getAttribute("src"),imageAlt:image?.alt || title});
  });
});

const experienceDetails = {
  bmkg: {
    id: { eyebrow:"PENGALAMAN MAGANG · BMKG", title:"IT Intern — Stasiun Meteorologi Minangkabau", body:"Selama magang, saya membantu pengembangan dan pemeliharaan website instansi bersama tim IT.", items:["Memperbarui tampilan halaman (UI slicing) dan konten informasi.","Melakukan pengujian fungsionalitas setelah perubahan.","Berkoordinasi dengan tim IT untuk kebutuhan pembaruan dan perbaikan."], note:"Dokumentasi di bawah menampilkan pengalaman magang dan website yang dikerjakan.", gallery:[{src:"gambar/pengalaman-bmkg.jpg",alt:"Dokumentasi magang di BMKG Minangkabau",caption:"Dokumentasi magang di BMKG Minangkabau"},{src:"gambar/project-bmkg.jpg",alt:"Website BMKG Minangkabau",caption:"Website BMKG Minangkabau"}] },
    en: { eyebrow:"INTERNSHIP · BMKG", title:"IT Intern — Minangkabau Meteorological Station", body:"During my internship, I supported the agency website’s development and maintenance alongside the IT team.", items:["Updated page layouts (UI slicing) and information content.","Performed functional checks after updates.","Coordinated with the IT team on website improvements."], note:"The images show my internship and the website I worked on.", gallery:[{src:"gambar/pengalaman-bmkg.jpg",alt:"BMKG Minangkabau internship",caption:"Internship documentation at BMKG Minangkabau"},{src:"gambar/project-bmkg.jpg",alt:"BMKG Minangkabau website",caption:"BMKG Minangkabau website"}] }
  },
  expo: {
    id: { eyebrow:"PENGALAMAN · EXPO FT UNP", title:"Demonstrator IoT", body:"Saya berperan sebagai demonstrator IoT di Expo FT UNP.", items:["Memperkenalkan dan mendemonstrasikan proyek IoT kepada pengunjung.","Menjelaskan fungsi perangkat dan cara kerja sistem secara langsung."], note:"Foto proyek Smart Home ditampilkan sebagai contoh proyek IoT dalam portofolio.", gallery:[{src:"gambar/pengalaman-expo-iot.jpg",alt:"Dokumentasi demonstrator IoT di Expo FT",caption:"Dokumentasi Expo FT UNP"},{src:"gambar/project-smarthome.jpg",alt:"Proyek Smart Home IoT",caption:"Proyek Smart Home IoT di portofolio"}] },
    en: { eyebrow:"EXPERIENCE · EXPO FT UNP", title:"IoT Demonstrator", body:"I served as an IoT demonstrator at Expo FT UNP.", items:["Introduced and demonstrated an IoT project to visitors.","Explained the device functions and system operation in person."], note:"The Smart Home image is shown as an IoT project from my portfolio.", gallery:[{src:"gambar/pengalaman-expo-iot.jpg",alt:"IoT demonstrator at Expo FT",caption:"Expo FT UNP documentation"},{src:"gambar/project-smarthome.jpg",alt:"Smart Home IoT project",caption:"Smart Home IoT project in my portfolio"}] }
  },
  teaching: {
    id: { eyebrow:"PRAKTIK MENGAJAR", title:"Guru Magang — SMK Muhammadiyah 1 Padang", body:"Saya memperoleh pengalaman mengajar bidang jaringan komputer dan keamanan jaringan.", items:["Menyiapkan rencana pembelajaran, modul, dan media ajar.","Membimbing siswa saat praktik laboratorium jaringan.","Mengevaluasi pemahaman dan capaian belajar siswa."], note:"Media pembelajaran AR ditampilkan sebagai karya akademik terkait bidang pendidikan.", gallery:[{src:"gambar/pengalaman-mengajar.jpg",alt:"Dokumentasi praktik mengajar",caption:"Dokumentasi praktik mengajar"},{src:"gambar/project-ar.jpg",alt:"Media pembelajaran augmented reality",caption:"Media pembelajaran AR dalam portofolio"}] },
    en: { eyebrow:"TEACHING PRACTICE", title:"Teaching Intern — SMK Muhammadiyah 1 Padang", body:"I gained teaching experience in computer networking and network security.", items:["Prepared lesson plans, modules, and learning media.","Guided students during networking lab practice.","Assessed students’ understanding and learning progress."], note:"The AR learning media is shown as a related academic education project.", gallery:[{src:"gambar/pengalaman-mengajar.jpg",alt:"Teaching practice documentation",caption:"Teaching practice documentation"},{src:"gambar/project-ar.jpg",alt:"Augmented reality learning media",caption:"AR learning media in my portfolio"}] }
  }
};
document.querySelectorAll(".exp-detail-btn").forEach((button) => button.addEventListener("click", () => {
  const details = experienceDetails[button.dataset.experience]?.[currentLanguage];
  if (details) openDetail(details);
}));

// Modal close, backdrop close, Escape.
document.querySelectorAll(".modal").forEach((modal) => {
  modal.querySelector(".modal-close")?.addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (event) => { if (event.target === modal) modal.classList.remove("open"); });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") document.querySelectorAll(".modal.open").forEach((modal) => modal.classList.remove("open"));
});

// Project carousel: arrow buttons, keyboard, and touch swipe.
const projectCards = [...document.querySelectorAll(".project-card")];
const projectStage = document.querySelector(".projects-stack");
let activeProject = 0;
function drawProjects() {
  if (!projectCards.length) return;
  projectCards.forEach((card, index) => {
    let distance = (index - activeProject + projectCards.length) % projectCards.length;
    if (distance > Math.floor(projectCards.length / 2)) distance -= projectCards.length;
    const depth = Math.abs(distance);
    card.style.transform = `translate3d(${distance * 9}px,${depth * 14}px,${-depth * 28}px) scale(${1 - depth * .045}) rotate(${distance * 1.1}deg)`;
    card.style.zIndex = String(20 - depth); card.style.opacity = depth > 2 ? "0" : String(1 - depth * .13);
    card.style.visibility = depth > 2 ? "hidden" : "visible"; card.style.pointerEvents = distance === 0 ? "auto" : "none";
    card.setAttribute("aria-hidden", String(distance !== 0));
  });
  const count = document.querySelector(".project-count");
  if (count) count.textContent = `${String(activeProject + 1).padStart(2,"0")} / ${String(projectCards.length).padStart(2,"0")}`;
}
function moveProject(step) { activeProject = (activeProject + step + projectCards.length) % projectCards.length; drawProjects(); }
document.querySelector("#nextProject")?.addEventListener("click", () => moveProject(1));
document.querySelector("#prevProject")?.addEventListener("click", () => moveProject(-1));
projectStage?.addEventListener("keydown", (event) => { if (event.key === "ArrowRight") { event.preventDefault(); moveProject(1); } if (event.key === "ArrowLeft") { event.preventDefault(); moveProject(-1); } });
let projectTouchX = 0;
projectStage?.addEventListener("touchstart", (event) => { projectTouchX = event.touches[0].clientX; }, { passive:true });
projectStage?.addEventListener("touchend", (event) => { const delta = event.changedTouches[0].clientX - projectTouchX; if (Math.abs(delta) > 38) moveProject(delta < 0 ? 1 : -1); }, { passive:true });
drawProjects();

// Number counters.
const metricObserver=new IntersectionObserver((entries)=>entries.forEach((entry)=>{
  const el=entry.target, card=el.closest(".edu-publication");
  if(entry.isIntersecting){const target=Number(el.dataset.value),decimals=Number(el.dataset.decimals),start=performance.now(),duration=950;function tick(now){const progress=Math.min(1,(now-start)/duration),ease=1-Math.pow(1-progress,3);el.textContent=(target*ease).toFixed(decimals).replace(".",",");if(progress<1)requestAnimationFrame(tick);}requestAnimationFrame(tick);card?.classList.add("is-counting");}
  else {el.textContent="0";card?.classList.remove("is-counting");}
}),{threshold:.35});
document.querySelectorAll(".count-up").forEach((el)=>metricObserver.observe(el));

// Bilingual labels and portfolio copy.
const translations={
  en:{
    ".navlinks a":["About","Skills","Projects","Experience","Education","Training"],".nav-cta":"Let’s connect ↗",
    ".hero .eyebrow .mono":"FRONT-END ENGINEER · WEB DEVELOPER",".hero h1":"Hello, I’m<br><em>Cinta.</em>",".float-tag":"pixel perfect ✳",".exp-detail-btn":"View details ↗",".hero-copy":"I’m a recent Informatics Education graduate from Universitas Negeri Padang with internship experience at BMKG Minangkabau. I contributed to website development and maintenance, updated page layouts and content, and tested functionality. I have experience with HTML, CSS, JavaScript, React.js, Vue.js, Tailwind CSS, Angular, Bootstrap, PHP, Laravel, Kotlin, and Arduino Uno. I’m seeking an opportunity to gain further experience in front-end and web application development.",
    ".hero-actions .btn:first-child":"View projects ↘",".hero-actions .btn:last-child":"Contact me ↗",
    ".about .mono":"01 — ABOUT ME",".about h2":"Designing interfaces. Building reliable web experiences.",".about-copy:first-of-type":"A graduate of <strong>Informatics Education at Universitas Negeri Padang (GPA 3.60/4.00)</strong>, focused on front-end and web application development.",".about-copy:nth-of-type(2)":"My BMKG internship involved website updates, content management, and functional testing.",".stat:first-child span":"work experiences",".stat:last-child span":"AR media practicality",
    ".skills-section .section-top .mono":"02 — SKILLS",".skills-section h2":"Skills & toolkit",".skills-section .section-top p":"Technical foundations for web development, system integration, and interface design.",".skill-panel:nth-child(1) .mono":"01 / TECHNOLOGIES & TOOLS",".skill-panel:nth-child(1) h3":"My toolkit",".skill-panel:nth-child(2) .mono":"02 / TECHNICAL SKILLS",".skill-panel:nth-child(2) h3":"Technical foundations",".skill-panel:nth-child(2) li":["UI/UX slicing & responsive web design","API integration & state management","Data tables, filtering & performance optimization","MySQL databases & back-end integration","Testing & end-to-end feature development"],".skill-panel:nth-child(3) .mono":"03 / SOFT SKILLS",".skill-panel:nth-child(3) h3":"How I work",".skill-panel:nth-child(3) li":["Async communication & IT team coordination","Product-oriented problem solving","Code documentation & feature presentations","Time management & adapting to technology","Attention to detail in QA testing"],
    ".projects .section-top .mono":"03 — SELECTED WORK",".projects h2":"Projects",".projects .section-top p":"A collection of web, application, interface design, and IoT work.",".project-meta .mono:first-child":["01 / professional experience","02 / website project","03 / coursework","04 / research publication","05 / application project","06 / IoT project"],".project-info h3":["BMKG Minangkabau Website","Extracurricular Website","MyTelkomsel App Design","AR Learning Media","Little Steps","Smart Home IoT Application"],".project-info p":["Website development and maintenance, including interface updates and functional testing.","A dynamic, responsive school extracurricular website.","A mobile interface design exercise inspired by MyTelkomsel; not an official Telkomsel project.","3D computer hardware learning media with gamification for vocational IT students.","The Little Steps application I worked on as a project.","A smart home application project using IoT technology."],".detail-btn":"View details ↗",
    ".experience .section-top .mono":"04 — EXPERIENCE",".experience h2":"Experience",".experience .section-top p":"Experience across IT, IoT demonstrations, and teaching.",".exp-card h3":["IT Intern","IoT Demonstrator","Teaching Intern"],".exp-card .exp-org":["Minangkabau Meteorological Station · BMKG","Expo FT UNP","SMK Muhammadiyah 1 Padang"],".exp-card .exp-body p":["Updated the agency website interface and content, tested functionality, and worked with the IT team.","Demonstrated a hardware and web interface integration project at Expo FT.","Taught networking and network security, prepared learning materials, guided lab practice, and assessed student progress."],
    ".education .section-top .mono":"05 — EDUCATION",".education h2":"Education",".education .section-top p":"Academic foundations in computing and software development.",".gpa .mono":"Grade point average",".edu-foot span":"Focus",".edu-foot b":"Web Development · System Integration · UI/UX",
    ".certifications .section-top .mono":"06 — LEARNING & CREDENTIALS",".certifications h2":"Training & Certifications",".cert-detail-btn":"View details ↗",".cert-topline .mono":["CERTIFICATION · 2025","CERTIFICATION · 2026","TRAINING · 2026","TRAINING · 2026","TRAINING · 2026"],".cert-hint":"Use the arrows or swipe to browse. Add each image using the filename in GANTI-GAMBAR.txt.",
    ".contact .mono":"GET IN TOUCH",".contact h2":"Let’s build something<br>meaningful.",".contact p":"I’m open to discussing digital products, front-end development, and internship opportunities.",".contact-actions .contact-method":["Email me ↗","WhatsApp +62 852-6643-5905","LinkedIn ↗"],".footer-link-email":"Email",".footer-link-phone":"WhatsApp",".footer-link-linkedin":"LinkedIn",".footer-legal":"© 2026 Cinta Bening Prastanti"
  },
  id:{
    ".navlinks a":["Tentang","Skill","Proyek","Pengalaman","Pendidikan","Pelatihan"],".nav-cta":"Mari terhubung ↗",
    ".hero .eyebrow .mono":"FRONT-END ENGINEER · WEB DEVELOPER",".hero h1":"Hai, aku<br><em>Cinta.</em>",".float-tag":"detail visual ✳",".exp-detail-btn":"Lihat detail ↗",".hero-copy":"Saya lulusan baru Pendidikan Teknik Informatika Universitas Negeri Padang dengan pengalaman magang di BMKG Minangkabau. Saya terlibat dalam pengembangan dan pemeliharaan website, memperbarui tampilan dan konten, serta menguji fungsionalitas. Saya memiliki pengalaman menggunakan HTML, CSS, JavaScript, React.js, Vue.js, Tailwind CSS, Angular, Bootstrap, PHP, Laravel, Kotlin, dan Arduino Uno. Saat ini saya mencari kesempatan untuk mengembangkan pengalaman di bidang front-end dan pengembangan aplikasi web.",
    ".hero-actions .btn:first-child":"Lihat proyek ↘",".hero-actions .btn:last-child":"Hubungi saya ↗",
    ".about .mono":"01 — TENTANG SAYA",".about h2":"Merancang antarmuka. Membangun pengalaman web yang andal.",".about-copy:first-of-type":"Lulusan <strong>Pendidikan Teknik Informatika, Universitas Negeri Padang (IPK 3,60/4,00)</strong> dengan fokus pada pengembangan front-end dan aplikasi web.",".about-copy:nth-of-type(2)":"Pengalaman magang di BMKG mencakup pembaruan website, pengelolaan konten, dan pengujian fungsionalitas.",".stat:first-child span":"pengalaman",".stat:last-child span":"kepraktisan media AR",
    ".skills-section .section-top .mono":"02 — KEMAMPUAN",".skills-section h2":"Skill & toolkit",".skills-section .section-top p":"Fondasi teknis untuk pengembangan web, integrasi sistem, dan desain antarmuka.",".skill-panel:nth-child(1) .mono":"01 / TEKNOLOGI & TOOLS",".skill-panel:nth-child(1) h3":"Perangkat yang saya gunakan",".skill-panel:nth-child(2) .mono":"02 / KETERAMPILAN TEKNIS",".skill-panel:nth-child(2) h3":"Fondasi teknis",".skill-panel:nth-child(2) li":["UI/UX slicing & desain web responsif","Integrasi API & pengelolaan state","Tabel data, filter & optimasi performa","Basis data MySQL & integrasi back-end","Pengujian & pengembangan fitur end-to-end"],".skill-panel:nth-child(3) .mono":"03 / KETERAMPILAN PERSONAL",".skill-panel:nth-child(3) h3":"Cara saya bekerja",".skill-panel:nth-child(3) li":["Komunikasi asinkron & koordinasi tim IT","Pemecahan masalah berorientasi produk","Dokumentasi kode & presentasi fitur","Manajemen waktu & adaptasi teknologi","Teliti dalam pengujian QA"],
    ".projects .section-top .mono":"03 — KARYA PILIHAN",".projects h2":"Proyek",".projects .section-top p":"Kumpulan proyek web, aplikasi, desain antarmuka, dan IoT.",".project-meta .mono:first-child":["01 / pengalaman profesional","02 / proyek website","03 / tugas kuliah","04 / publikasi ilmiah","05 / proyek aplikasi","06 / proyek IoT"],".project-info h3":["Website BMKG Minangkabau","Website Ekskul","Desain aplikasi MyTelkomsel","Media Pembelajaran AR","Little Steps","Aplikasi Smart Home IoT"],".project-info p":["Pengembangan dan pemeliharaan website, termasuk pembaruan antarmuka dan pengujian fungsionalitas.","Website ekstrakurikuler sekolah yang dinamis dan responsif.","Latihan desain antarmuka mobile terinspirasi dari MyTelkomsel; bukan proyek resmi Telkomsel.","Media pembelajaran hardware komputer dengan visualisasi 3D dan gamifikasi untuk siswa SMK TKJ.","Aplikasi Little Steps yang saya kerjakan sebagai proyek.","Proyek aplikasi smart home menggunakan teknologi IoT."],".detail-btn":"Lihat detail ↗",
    ".experience .section-top .mono":"04 — PENGALAMAN",".experience h2":"Pengalaman",".experience .section-top p":"Pengalaman di bidang IT, demonstrasi IoT, dan pengajaran.",".exp-card h3":["IT Intern","Demonstrator IoT","Guru Magang"],".exp-card .exp-org":["Stasiun Meteorologi Minangkabau · BMKG","Expo FT UNP","SMK Muhammadiyah 1 Padang"],".exp-card .exp-body p":["Memperbarui antarmuka dan konten website instansi, menguji fungsionalitas, serta berkoordinasi dengan tim IT.","Mendemonstrasikan integrasi perangkat keras dan antarmuka web di Expo FT.","Mengajar jaringan komputer dan keamanan jaringan, menyiapkan bahan ajar, membimbing praktik, dan mengevaluasi capaian siswa."],
    ".education .section-top .mono":"05 — PENDIDIKAN",".education h2":"Pendidikan",".education .section-top p":"Bekal akademik di bidang komputasi dan pengembangan perangkat lunak.",".gpa .mono":"Indeks Prestasi Kumulatif",".edu-foot span":"Fokus",".edu-foot b":"Web Development · System Integration · UI/UX",
    ".certifications .section-top .mono":"06 — PELATIHAN & SERTIFIKASI",".certifications h2":"Pelatihan & Sertifikasi",".cert-detail-btn":"Lihat detail ↗",".cert-topline .mono":["SERTIFIKASI · 2025","SERTIFIKASI · 2026","PELATIHAN · 2026","PELATIHAN · 2026","PELATIHAN · 2026"],".cert-hint":"Gunakan panah atau geser untuk melihat. Tambahkan gambar dengan nama file di GANTI-GAMBAR.txt.",
    ".contact .mono":"HUBUNGI SAYA",".contact h2":"Mari membangun sesuatu<br>yang bermakna.",".contact p":"Saya terbuka untuk berdiskusi tentang produk digital, pengembangan front-end, dan kesempatan magang.",".contact-actions .contact-method":["Kirim email ↗","WhatsApp +62 852-6643-5905","LinkedIn ↗"],".footer-link-email":"Email",".footer-link-phone":"WhatsApp",".footer-link-linkedin":"LinkedIn",".footer-legal":"© 2026 Cinta Bening Prastanti"
  }
};
function applyLanguage(lang, remember=true) {
  currentLanguage=lang; document.documentElement.lang=lang;
  document.querySelector(".navlinks")?.setAttribute("aria-label",lang==="en"?"Main navigation":"Navigasi utama");
  document.querySelector(".language-switch")?.setAttribute("aria-label",lang==="en"?"Choose language":"Pilih bahasa");
  Object.entries(translations[lang]).forEach(([selector,value])=>{
    const nodes=[...document.querySelectorAll(selector)], values=Array.isArray(value)?value:[value];
    nodes.forEach((node,index)=>{if(values[index]===undefined)return; if((node.matches(".hero h1,.contact h2"))&&values[index].includes("<br>"))node.innerHTML=values[index];else if(node.matches(".about-copy")&&values[index].includes("<strong>"))node.innerHTML=values[index];else node.textContent=values[index];});
  });
  document.querySelectorAll(".language-option").forEach((button)=>{const active=button.dataset.language===lang;button.classList.toggle("active",active);button.setAttribute("aria-pressed",String(active));});
  const title=lang==="en"?"Cinta Bening Prastanti — Front-End Engineer & Web Developer":"Cinta Bening Prastanti — Front-End Engineer & Web Developer";
  document.title=title; applyTheme(document.documentElement.dataset.theme||"light");
  if(remember)savePreference("cinta-portfolio-language",lang);
}
document.querySelectorAll(".language-option").forEach((button)=>button.addEventListener("click",()=>applyLanguage(button.dataset.language)));
applyLanguage(readPreference("cinta-portfolio-language")==="en"?"en":"id",false);

// Mobile menu closes after navigation. Section links show the current location.
const menuButton=document.querySelector(".menu-btn"), navLinks=document.querySelector(".navlinks");
menuButton?.addEventListener("click",()=>{const open=navLinks.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(open));menuButton.textContent=open?"×":"☰";});
navLinks?.querySelectorAll("a").forEach((link)=>link.addEventListener("click",(event)=>{
  const target=document.querySelector(link.hash);
  if(target){event.preventDefault();const update=()=>{const top=target.getBoundingClientRect().top+window.scrollY-12;window.scrollTo({top,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});history.replaceState(null,"",link.hash);};
    if(document.startViewTransition&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.startViewTransition(update);else update();}
  navLinks.classList.remove("open");menuButton?.setAttribute("aria-expanded","false");if(menuButton)menuButton.textContent="☰";
}));
const sectionObserver=new IntersectionObserver((entries)=>entries.forEach((entry)=>{if(entry.isIntersecting)navLinks?.querySelectorAll("a").forEach((link)=>link.classList.toggle("active",link.hash==="#"+entry.target.id));}),{rootMargin:"-30% 0px -60% 0px"});
document.querySelectorAll("main section[id]").forEach((section)=>sectionObserver.observe(section));


// Subtle reveal transitions that respect the visitor’s motion preference.
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .12 });
  document.querySelectorAll(".section-top, .skill-panel, .exp-card, .edu-card, .cert-card").forEach((node) => { node.classList.add("reveal"); revealObserver.observe(node); });
}
