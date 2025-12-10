
(function () {
  const STORAGE_KEY = "slice-v1";
  const timelineEl = document.getElementById("timeline");
  const statusEl = document.getElementById("status");
  const streakLabel = document.getElementById("streak-label");
  const hintEl = document.getElementById("hint");

  const MICROCOPY = ["Silence the noisy tab. Keep only what you need for this hour.", "Pick one task that scares you a little and give it a clean 25 minutes.", "Reply only to the messages that truly move something forward.", "Tiny breaks beat big crashes. Stand, stretch, sip water.", "Name this hour out loud. Deep work? Rest? Own it.", "Write the first ugly draft. Pretty can come later.", "Mute one more notification than feels comfortable.", "Ask someone one non-boring question and listen all the way.", "Close your eyes for 30 seconds and notice 4 sounds.", "Move your body just enough to feel slightly silly.", "Pick the smallest version of the thing you’re avoiding.", "You don’t have to clear the list; you just choose the next slice.", "Set a tiny rule: no scrolling until this hour ends.", "Turn one errand into a future gift for yourself.", "If it takes under 2 minutes, ship it now.", "Write one sentence describing what ‘done’ looks like for this hour.", "Half-finished is fine. Showing up is the real streak.", "Let one ball drop on purpose. Protect the important one.", "Send a message you meant to send weeks ago.", "Lower the bar: aim for ‘slightly better’ not ‘perfect’.", "Listen to one song with no other tabs open.", "Make your desk 5% kinder to Future You.", "Say no to one micro-distraction. Notice how it feels.", "You can always pick a softer slice next hour.", "If you’re tired, rest is not a failure slice.", "Tidy one square foot of your space.", "Rename your task with friendlier words.", "Ask: what would make this hour easy mode?", "Turn your phone face down for 10 minutes.", "This hour doesn’t have to prove anything.", "Make a tiny checklist, then enjoy crossing one thing off.", "Let this slice be narrow so you can actually cut through."];

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { "entries": [] };
      return JSON.parse(raw);
    } catch (e) {
      console.warn("[Slice] failed to load state", e);
      return { "entries": [] };
    }
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("[Slice] failed to save state", e);
    }
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function renderTimeline(entries) {
    if (!timelineEl) return;
    timelineEl.innerHTML = "";
    const last8 = entries.slice(-8);
    if (last8.length === 0) {
      for (let i = 0; i < 8; i++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        timelineEl.appendChild(tile);
      }
      return;
    }
    const padded = [...last8];
    while (padded.length < 8) padded.unshift(null);
    padded.forEach((e) => {
      const tile = document.createElement("div");
      tile.className = "tile";
      if (e && e.type) tile.dataset.type = e.type;
      timelineEl.appendChild(tile);
    });
  }

  function updateStatus(entries) {
    const key = todayKey();
    const todays = entries.filter((e) => e.date === key);
    if (statusEl) {
      if (todays.length) {
        const last = todays[todays.length - 1];
        const label = last.type === "deep" ? "Deep work" :
                      last.type === "social" ? "Social" :
                      last.type === "rest" ? "Rest" :
                      last.type === "errands" ? "Errands" : "Unknown";
        statusEl.textContent = "Current slice: " + label;
      } else {
        statusEl.textContent = "No slice chosen yet.";
      }
    }
    if (streakLabel) {
      streakLabel.textContent = todays.length + (todays.length === 1 ? " slice today" : " slices today");
    }
  }

  function randomMicrocopy() {
    if (!MICROCOPY.length) return "";
    const idx = Math.floor(Math.random() * MICROCOPY.length);
    return MICROCOPY[idx];
  }

  function setHint(text) {
    if (hintEl) hintEl.textContent = text || "";
  }

  function chooseSlice(type) {
    const now = new Date();
    const entry = {
      date: todayKey(),
      ts: now.toISOString(),
      type
    };
    const state = loadState();
    const updated = [...(state.entries || []), entry];
    saveState({ entries: updated });
    renderTimeline(updated);
    updateStatus(updated);
    setHint(randomMicrocopy());
  }

  function init() {
    const state = loadState();
    renderTimeline(state.entries || []);
    updateStatus(state.entries || []);
    if (state.entries && state.entries.length) {
      setHint(randomMicrocopy());
    }

    document.querySelectorAll(".slice-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        if (!type) return;
        chooseSlice(type);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
