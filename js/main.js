// ============ テーマ切替(システム設定に追従 + 手動上書きをlocalStorageに保存) ============
(function () {
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    document.documentElement.dataset.theme = saved;
  }
  const btn = document.getElementById("theme-toggle");
  btn.addEventListener("click", () => {
    const systemDark = matchMedia("(prefers-color-scheme: dark)").matches;
    const current = document.documentElement.dataset.theme || (systemDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });
})();

// ============ スクロールスパイ(表示中のセクションをナビで強調) ============
(function () {
  const links = document.querySelectorAll(".global-nav a[data-spy]");
  const sections = [...links].map((a) => document.getElementById(a.dataset.spy)).filter(Boolean);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.dataset.spy === e.target.id));
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));
})();

// ============ スクロール出現アニメーション ============
(function () {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

// ============ スクリーンショットカルーセルのドット ============
(function () {
  const carousel = document.getElementById("carousel");
  const dotsBox = document.getElementById("carousel-dots");
  if (!carousel || !dotsBox) return;
  const imgs = [...carousel.querySelectorAll("img")];
  imgs.forEach((img, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `スクリーンショット${i + 1}枚目`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => {
      carousel.scrollTo({ left: img.offsetLeft - carousel.offsetLeft, behavior: "smooth" });
    });
    dotsBox.appendChild(dot);
  });
  const dots = [...dotsBox.children];
  carousel.addEventListener(
    "scroll",
    () => {
      const idx = Math.round(carousel.scrollLeft / (carousel.scrollWidth / imgs.length));
      dots.forEach((d, i) => d.classList.toggle("active", i === Math.min(idx, imgs.length - 1)));
    },
    { passive: true }
  );
})();

// ============ メールアドレス表示(スクレイピング対策でJS組み立て) ============
(function () {
  const btn = document.getElementById("email-reveal");
  if (!btn) return;
  btn.addEventListener(
    "click",
    () => {
      const addr = `${btn.dataset.u}@${btn.dataset.d}`;
      const link = document.createElement("a");
      link.href = `mailto:${addr}`;
      link.textContent = addr;
      link.className = "contact-value";
      link.style.display = "block";
      btn.replaceWith(link);
      navigator.clipboard?.writeText(addr).catch(() => {});
    },
    { once: true }
  );
})();

// ============ トップへ戻るボタン ============
(function () {
  const btn = document.getElementById("to-top");
  addEventListener(
    "scroll",
    () => btn.classList.toggle("show", scrollY > 600),
    { passive: true }
  );
  btn.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
})();
