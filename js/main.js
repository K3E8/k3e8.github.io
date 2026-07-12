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

// ============ PICKUPスライダー: クリックでストアへ / ドラッグ・スワイプで切替 ============
(function () {
  const track = document.getElementById("pickup-track");
  const dotsBox = document.getElementById("pickup-dots");
  if (!track || !dotsBox) return;
  const cards = [...track.querySelectorAll(".pickup-card")];
  const slideW = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth || 1);
  const nearestIndex = () =>
    Math.max(0, Math.min(cards.length - 1, Math.round(track.scrollLeft / slideW())));

  // 自前のスムーズスクロール(scroll-snapと競合しないよう、移動中はスナップを切る)
  const glideTo = (left) => {
    track.classList.add("dragging");
    const from = track.scrollLeft;
    const dist = left - from;
    const t0 = performance.now();
    const dur = 320;
    let started = false;
    const step = (t) => {
      started = true;
      const p = Math.min(1, (t - t0) / dur);
      track.scrollLeft = from + dist * (1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(step);
      else {
        track.classList.remove("dragging");
        track.dispatchEvent(new Event("scroll"));
      }
    };
    requestAnimationFrame(step);
    // rAFが抑制される環境(非表示タブ等)では瞬間移動にフォールバック
    setTimeout(() => {
      if (!started) {
        track.scrollLeft = left;
        track.classList.remove("dragging");
        track.dispatchEvent(new Event("scroll"));
      }
    }, 120);
  };

  // ドット生成と現在位置の反映
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `アプリ紹介 ${i + 1}枚目を表示`);
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => glideTo(i * slideW()));
    dotsBox.appendChild(dot);
  });
  const dots = [...dotsBox.children];
  track.addEventListener(
    "scroll",
    () => dots.forEach((d, i) => d.classList.toggle("active", i === nearestIndex())),
    { passive: true }
  );

  // マウスの左右ドラッグでスライド(タッチはOS標準のスワイプがそのまま効く)
  let down = false;
  let dragged = false;
  let startX = 0;
  let startScroll = 0;
  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return;
    down = true;
    dragged = false;
    startX = e.clientX;
    startScroll = track.scrollLeft;
  });
  track.addEventListener("pointermove", (e) => {
    if (!down) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 8) {
      dragged = true;
      track.classList.add("dragging");
      track.scrollLeft = startScroll - dx;
    }
  });
  const endDrag = (e) => {
    if (!down) return;
    down = false;
    if (dragged) {
      // 60px以上ドラッグしたらその方向に1枚送る。それ未満は元の位置に戻す
      const dx = e.clientX - startX;
      let idx = Math.round(startScroll / slideW());
      if (Math.abs(dx) > 60) idx += dx < 0 ? 1 : -1;
      idx = Math.max(0, Math.min(cards.length - 1, idx));
      glideTo(idx * slideW());
    }
  };
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointerleave", endDrag);

  // カードのどこをクリックしてもストアへ(リンク・QR・ドラッグ直後・文字選択中は除く)
  cards.forEach((card) => {
    const href = card.dataset.href;
    if (!href) return;
    card.addEventListener("click", (e) => {
      if (dragged) return;
      if (e.target.closest("a, details, button")) return;
      if (getSelection().toString()) return;
      open(href, "_blank", "noopener");
    });
  });
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
