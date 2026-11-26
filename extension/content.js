(() => {
  const LESSON_RE = /\/lessons\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
  const COPY_ICON =
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const CHECK_ICON =
    '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  const getLessonId = () => location.pathname.match(LESSON_RE)?.[1] ?? null;

  const btn = document.createElement("button");
  btn.id = "bdlip-copy-btn";
  btn.type = "button";
  btn.innerHTML = COPY_ICON;
  btn.title = "Copy lesson ID";

  const toast = document.createElement("div");
  toast.id = "bdlip-toast";

  let resetTimer;
  const flash = (msg, ok) => {
    toast.textContent = msg;
    toast.classList.toggle("bdlip-error", !ok);
    toast.classList.add("bdlip-show");
    btn.innerHTML = ok ? CHECK_ICON : COPY_ICON;
    btn.classList.toggle("bdlip-ok", ok);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      toast.classList.remove("bdlip-show");
      btn.innerHTML = COPY_ICON;
      btn.classList.remove("bdlip-ok");
    }, 1800);
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      if (!ok) throw new Error("copy failed");
    }
  };

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const id = getLessonId();
    if (!id) return flash("No lesson ID on this page", false);
    try {
      await copy(id);
      flash(`Copied ${id}`, true);
    } catch {
      flash("Couldn't copy to clipboard", false);
    }
  });

  // boot.dev is a single-page app, so the URL changes without a reload.
  // Show the button only on lesson pages and re-check periodically.
  const sync = () => {
    const onLesson = !!getLessonId();
    if (onLesson && !btn.isConnected) {
      document.body.append(btn, toast);
    } else if (!onLesson && btn.isConnected) {
      btn.remove();
      toast.remove();
    }
    if (onLesson) btn.title = `Copy lesson ID (${getLessonId()})`;
  };

  sync();
  let lastPath = location.pathname;
  setInterval(() => {
    if (location.pathname !== lastPath || (getLessonId() && !btn.isConnected)) {
      lastPath = location.pathname;
      sync();
    }
  }, 500);
})();
