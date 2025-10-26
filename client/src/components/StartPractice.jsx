import React, { useEffect, useRef, useState } from "react";
import HeaderPublic from "./HeaderPublic";

// StartPractice.jsx
// Single-file React component containing all logic and 99 names hardcoded.
// - Textarea collects typed or transcribed speech
// - Web Speech API (start/stop mic) appends transcript to textarea
// - Fuzzy matching with normalization + Levenshtein similarity
// - Keeps only unique matched names per session
// - Saves latest 3 scores to localStorage
// - Shows missed names and previous 3 scores

const ALLAH_NAMES = [
  { arabic: "الرَّحْمَنُ", english: "Ar-Rahman", meaning: "The Most Compassionate" },
  { arabic: "الرَّحِيمُ", english: "Ar-Rahim", meaning: "The Most Merciful" },
  { arabic: "الْمَلِكُ", english: "Al-Malik", meaning: "The Absolute Ruler" },
  { arabic: "الْقُدُّوسُ", english: "Al-Quddus", meaning: "The Pure One" },
  { arabic: "السَّلاَمُ", english: "As-Salam", meaning: "The Source of Peace" },
  { arabic: "الْمُؤْمِنُ", english: "Al-Mu'min", meaning: "Giver of Faith and Security" },
  { arabic: "الْمُهَيْمِنُ", english: "Al-Muhaymin", meaning: "The Protector" },
  { arabic: "الْعَزِيزُ", english: "Al-Aziz", meaning: "The Almighty" },
  { arabic: "الْجَبَّارُ", english: "Al-Jabbar", meaning: "The Compeller" },
  { arabic: "الْمُتَكَبِّرُ", english: "Al-Mutakabbir", meaning: "The Majestic, the Supremely Great" },
  { arabic: "الْخَالِقُ", english: "Al-Khaliq", meaning: "The Creator" },
  { arabic: "الْبَارِئُ", english: "Al-Bari'", meaning: "The Evolver" },
  { arabic: "الْمُصَوِّرُ", english: "Al-Musawwir", meaning: "The Fashioner" },
  { arabic: "الْغَفَّارُ", english: "Al-Ghaffar", meaning: "The Constant Forgiver" },
  { arabic: "الْقَهَّارُ", english: "Al-Qahhar", meaning: "The All-Subduer" },
  { arabic: "الْوَهَّابُ", english: "Al-Wahhab", meaning: "The Supreme Bestower" },
  { arabic: "الرَّزَّاقُ", english: "Ar-Razzaq", meaning: "The Provider" },
  { arabic: "الْفَتَّاحُ", english: "Al-Fattah", meaning: "The Supreme Opener" },
  { arabic: "اَلْعَلِيمُ", english: "Al-Alim", meaning: "The All-Knowing" },
  { arabic: "الْقَابِضُ", english: "Al-Qabid", meaning: "The Withholder" },
  { arabic: "الْبَاسِطُ", english: "Al-Basit", meaning: "The Extender" },
  { arabic: "الْخَافِضُ", english: "Al-Khafid", meaning: "The Reducer" },
  { arabic: "الرَّافِعُ", english: "Ar-Rafi", meaning: "The Exalter" },
  { arabic: "الْمُعِزُّ", english: "Al-Mu'izz", meaning: "Bestower of Honour" },
  { arabic: "المُذِلُّ", english: "Al-Mudhill", meaning: "The Dishonourer" },
  { arabic: "السَّمِيعُ", english: "As-Sami", meaning: "All-Hearing" },
  { arabic: "الْبَصِيرُ", english: "Al-Basir", meaning: "All-Seeing" },
  { arabic: "الْحَكَمُ", english: "Al-Hakam", meaning: "The Impartial Judge" },
  { arabic: "الْعَدْلُ", english: "Al-Adl", meaning: "The Utterly Just" },
  { arabic: "اللَّطِيفُ", english: "Al-Latif", meaning: "The Subtle One" },
  { arabic: "الْخَبِيرُ", english: "Al-Khabir", meaning: "All-Aware" },
  { arabic: "الْحَلِيمُ", english: "Al-Halim", meaning: "The Forbearing" },
  { arabic: "الْعَظِيمُ", english: "Al-Azim", meaning: "The Magnificent" },
  { arabic: "الْغَفُورُ", english: "Al-Ghafoor", meaning: "The Great Forgiver" },
  { arabic: "الشَّكُورُ", english: "Ash-Shakur", meaning: "The Most Appreciative" },
  { arabic: "الْعَلِيُّ", english: "Al-Aliyy", meaning: "The Most High" },
  { arabic: "الْكَبِيرُ", english: "Al-Kabir", meaning: "The Most Great" },
  { arabic: "الْحَفِيظُ", english: "Al-Hafiz", meaning: "Preserver" },
  { arabic: "المُقيت", english: "Al-Muqit", meaning: "Sustainer" },
  { arabic: "الْحسِيبُ", english: "Al-Hasib", meaning: "The Reckoner" },
  { arabic: "الْجَلِيلُ", english: "Al-Jalil", meaning: "The Majestic" },
  { arabic: "الْكَرِيمُ", english: "Al-Karim", meaning: "The Most Generous" },
  { arabic: "الرَّقِيبُ", english: "Ar-Raqib", meaning: "The Watchful" },
  { arabic: "الْمُجِيبُ", english: "Al-Mujib", meaning: "Responder" },
  { arabic: "الْوَاسِعُ", english: "Al-Wasi", meaning: "The All-Encompassing" },
  { arabic: "الْحَكِيمُ", english: "Al-Hakim", meaning: "The All-Wise" },
  { arabic: "الْوَدُودُ", english: "Al-Wadud", meaning: "Most Loving" },
  { arabic: "الْمَجِيدُ", english: "Al-Majid", meaning: "Glorious" },
  { arabic: "الْبَاعِثُ", english: "Al-Ba'ith", meaning: "The Infuser of New Life" },
  { arabic: "الشَّهِيدُ", english: "Ash-Shahid", meaning: "The All Observing Witness" },
  { arabic: "الْحَقُّ", english: "Al-Haqq", meaning: "The Absolute Truth" },
  { arabic: "الْوَكِيلُ", english: "Al-Wakil", meaning: "The Trustee, Disposer of Affairs" },
  { arabic: "الْقَوِيُّ", english: "Al-Qawiyy", meaning: "The All-Strong" },
  { arabic: "الْمَتِينُ", english: "Al-Matin", meaning: "The Firm One" },
  { arabic: "الْوَلِيُّ", english: "Al-Waliyy", meaning: "Protecting Associate" },
  { arabic: "الْحَمِيدُ", english: "Al-Hamid", meaning: "The Praiseworthy" },
  { arabic: "الْمُحْصِي", english: "Al-Muhsi", meaning: "The All-Enumerating, Originator" },
  { arabic: "الْمُبْدِئُ", english: "Al-Mubdi'", meaning: "The Originator" },
  { arabic: "الْمُعِيدُ", english: "Al-Mu'id", meaning: "The Restorer" },
  { arabic: "الْمُحْيِي", english: "Al-Muhyi", meaning: "The Giver of Life" },
  { arabic: "الْمُمِيتُ", english: "Al-Mumit", meaning: "The Creator of Death" },
  { arabic: "الْحَيُّ", english: "Al-Hayy", meaning: "The Ever-Living" },
  { arabic: "الْقَيُّومُ", english: "Al-Qayyum", meaning: "The Sustainer" },
  { arabic: "الْوَاجِدُ", english: "Al-Wajid", meaning: "The Perceiver" },
  { arabic: "الْمَاجِدُ", english: "Al-Majid", meaning: "Glorious (alternate entry)" },
  { arabic: "الْواحِدُ", english: "Al-Wahid", meaning: "The One" },
  { arabic: "الصَّمَدُ", english: "As-Samad", meaning: "Self-Sufficient" },
  { arabic: "الْقَادِرُ", english: "Al-Qadir", meaning: "The All-Capable" },
  { arabic: "الْمُقْتَدِرُ", english: "Al-Muqtadir", meaning: "The Creator of All Power" },
  { arabic: "الْمُقَدِّمُ", english: "Al-Muqaddim", meaning: "Expeditor" },
  { arabic: "الْمُؤَخِّرُ", english: "Al-Mu'akhkhir", meaning: "Delayer" },
  { arabic: "الأَوَّلُ", english: "Al-Awwal", meaning: "The First" },
  { arabic: "الْآخِرُ", english: "Al-Akhir", meaning: "The Last" },
  { arabic: "الظَّاهِرُ", english: "Az-Zahir", meaning: "The Manifest One" },
  { arabic: "الْبَاطِنُ", english: "Al-Batin", meaning: "The Hidden One" },
  { arabic: "الْوَالِي", english: "Al-Wali", meaning: "Sole Controller" },
  { arabic: "الْمُتَعَالِي", english: "Al-Muta'ali", meaning: "Self Exalted" },
  { arabic: "الْبَرُّ", english: "Al-Barr", meaning: "The Source of All Goodness" },
  { arabic: "التَّوَّابُ", english: "At-Tawwab", meaning: "Ever-Accepter of Repentance" },
  { arabic: "الْمُنْتَقِمُ", english: "Al-Muntaqim", meaning: "Avenger" },
  { arabic: "العَفُوُّ", english: "Al-'Afuww", meaning: "The Supreme Pardoner" },
  { arabic: "الرَّؤُوفُ", english: "Ar-Ra'uf", meaning: "Most Kind" },
  { arabic: "مَالِكُ الْمُلْكِ", english: "Malik-ul-Mulk", meaning: "Owner of All" },
  { arabic: "ذُو الْجَلَالِ وَالإكْرَامِ", english: "Dhul-Jalaali Wal-Ikram", meaning: "Lord of Glory and Honour" },
  { arabic: "الْمُقْسِطُ", english: "Al-Muqsit", meaning: "The Just One" },
  { arabic: "الْجَامِعُ", english: "Al-Jami'", meaning: "Gatherer" },
  { arabic: "الْغَنِيُّ", english: "Al-Ghaniyy", meaning: "Self-Sufficient, Wealthy" },
  { arabic: "الْمُغْنِي", english: "Al-Mughni", meaning: "Enricher" },
  { arabic: "الْمَانِعُ", english: "Al-Mani'", meaning: "Withholder" },
  { arabic: "الضَّارُ", english: "Ad-Darr", meaning: "Distresser" },
  { arabic: "النَّافِعُ", english: "An-Nafi'", meaning: "Propitious, Benefactor" },
  { arabic: "النُّورُ", english: "An-Nur", meaning: "Light" },
  { arabic: "الْهَادِي", english: "Al-Hadi", meaning: "The Guide" },
  { arabic: "الْبَدِيعُ", english: "Al-Badi'", meaning: "Originator, Incomparable" },
  { arabic: "الْبَاقِي", english: "Al-Baqi", meaning: "Everlasting" },
  { arabic: "الْوَارِثُ", english: "Al-Warith", meaning: "Inheritance" },
  { arabic: "الرَّشِيدُ", english: "Ar-Rashid", meaning: "Righteous Teacher" },
  { arabic: "الصَّبُورُ", english: "As-Sabur", meaning: "The Patient One" }
];

export default function StartPractice() {
  const [practiceText, setPracticeText] = useState("");
  const [sessionResult, setSessionResult] = useState(null);
  const [scores, setScores] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("practiceScores"));
      return Array.isArray(s) ? s : [];
    } catch (e) {
      return [];
    }
  });
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      recognitionRef.current = null;
      return;
    }
    const r = new SpeechRecognition();
    r.continuous = true;
    r.interimResults = false;
    r.lang = "en-US";

    r.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      if (last && last[0]) {
        const transcript = last[0].transcript.trim();
        setPracticeText((prev) => (prev ? prev + " " + transcript : transcript));
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
          }
        }, 50);
      }
    };

    r.onerror = (e) => {
      console.error("Speech recognition error", e);
      setIsListening(false);
      try { r.stop(); } catch (_) {}
    };

    recognitionRef.current = r;
    return () => {
      try { r.stop(); } catch (_) {}
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("practiceScores", JSON.stringify(scores));
  }, [scores]);

  function normalize(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9؀-ۿ]/g, "")
      .replace(/^al|^ar|^ash|^az|^an|^as|^ad/, "")
      .trim();
  }

  function levenshtein(a, b) {
    if (!a || !b) return (a || b) ? Math.max((a || "").length, (b || "").length) : 0;
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  function similarity(a, b) {
    const aa = a || "";
    const bb = b || "";
    const dist = levenshtein(aa, bb);
    const maxLen = Math.max(aa.length, bb.length);
    if (maxLen === 0) return 1;
    return 1 - dist / maxLen;
  }

  function isNameMatch(userInput, correctName) {
    const input = normalize(userInput);
    const correct = normalize(correctName);
    if (!input || !correct) return false;
    if (correct === input) return true;
    if (correct.includes(input) || input.includes(correct)) return true;
    const sim = similarity(input, correct);
    if (sim >= 0.7) return true;
    const minCheck = Math.min(4, input.length, correct.length);
    if (minCheck >= 2 && input.slice(0, minCheck) === correct.slice(0, minCheck)) return true;
    return false;
  }

  function startMic() {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.warn("startMic error", e);
    }
  }

  function stopMic() {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.stop(); } catch (e) { console.warn("stopMic error", e); }
    setIsListening(false);
  }

  function handleEndPractice() {
    const tokens = practiceText
      .split(/[\s,.;!?\n\r\t]+/)
      .map((t) => t.trim())
      .filter(Boolean);

    const matched = new Set();

    for (const token of tokens) {
      for (const n of ALLAH_NAMES) {
        if (isNameMatch(token, n.english) || isNameMatch(token, n.arabic)) {
          matched.add(n.english);
          break;
        }
      }
    }

    const score = matched.size;
    const missed = ALLAH_NAMES.filter((n) => !matched.has(n.english));

    const updatedScores = [score, ...scores].slice(0, 3);
    setScores(updatedScores);
    localStorage.setItem("practiceScores", JSON.stringify(updatedScores));

    setSessionResult({ score, missed, matched: Array.from(matched) });

    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => { o.stop(); }, 120);
    } catch (e) {}
  }

  function handleResetScores() {
    setScores([]);
    localStorage.removeItem("practiceScores");
  }

  function handleClearText() {
    setPracticeText("");
    setSessionResult(null);
  }

  return (
      <>
        <HeaderPublic />
        <div className="min-h-screen bg-gray-50 p-6 flex items-start justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-bold mb-3">Allah's 99 Names — Practice</h1>
            <p className="text-sm text-gray-600 mb-4">Type or speak the names into the textarea. When done, press <strong>End Practice</strong>.</p>

            <div className="flex gap-3 mb-3">
            <button onClick={startMic} disabled={isListening} className={`px-4 py-2 rounded-lg border ${isListening ? "bg-gray-200 text-gray-600" : "bg-green-500 text-white"}`}>
                🎤 Start Mic
            </button>
            <button onClick={stopMic} disabled={!isListening} className="px-4 py-2 rounded-lg border bg-red-500 text-white">⏹ Stop Mic</button>
            <button onClick={handleClearText} className="px-4 py-2 rounded-lg border bg-gray-100">Clear Text</button>
            <button onClick={handleResetScores} className="px-4 py-2 rounded-lg border bg-gray-100">Reset Scores</button>
            </div>

            <textarea ref={textareaRef} rows={8} value={practiceText} onChange={(e) => setPracticeText(e.target.value)} placeholder="Type names or use the mic. The transcript will append here..." className="w-full border rounded p-3 text-lg" />

            <div className="flex justify-end mt-3">
            <button onClick={handleEndPractice} className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold">End Practice</button>
            </div>

            {sessionResult && (
            <div className="mt-6 p-4 border rounded bg-gray-50">
                <h2 className="text-xl font-semibold">Your score: {sessionResult.score} / {ALLAH_NAMES.length}</h2>
                <p className="text-sm text-gray-600">Unique correct names counted only once even if repeated.</p>

                {sessionResult.missed.length > 0 ? (
                <div className="mt-3">
                    <h3 className="font-semibold">You missed these names ({sessionResult.missed.length}):</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {sessionResult.missed.map((n, i) => (
                        <div key={i} className="p-2 border rounded">
                        <div className="font-medium">{n.english}</div>
                        <div className="text-xs text-gray-600">{n.arabic} — {n.meaning}</div>
                        </div>
                    ))}
                    </div>
                </div>
                ) : (
                <div className="mt-3 p-3 bg-green-50 rounded">Amazing — you practiced all names!</div>
                )}

                <div className="mt-4">
                <h3 className="font-semibold">Previous scores (latest 3)</h3>
                <ul className="list-disc ml-6 mt-2">
                    {scores.length === 0 && <li>No previous scores</li>}
                    {scores.map((s, i) => (
                    <li key={i}>Practice {i + 1}: {s} / {ALLAH_NAMES.length}</li>
                    ))}
                </ul>
                </div>

                <div className="mt-4 flex gap-2">
                <button onClick={() => navigator.clipboard?.writeText(sessionResult.missed.map(m=>m.english).join(", "))} className="px-3 py-2 bg-gray-100 rounded">Copy Missed Names</button>
                <button onClick={() => { setPracticeText(sessionResult.missed.map(m=>m.english).join("\n")) }} className="px-3 py-2 bg-gray-100 rounded">Load Missed into Textarea</button>
                </div>
            </div>
            )}

            <div className="mt-6">
            <h3 className="font-semibold mb-2">Names Table (quick view)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-auto p-2 border rounded">
                {ALLAH_NAMES.map((n, i) => (
                <div key={i} className="p-2 border rounded bg-white">
                    <div className="font-medium">{i + 1}. {n.english}</div>
                    <div className="text-sm text-gray-600">{n.arabic}</div>
                    <div className="text-xs text-gray-500">{n.meaning}</div>
                </div>
                ))}
            </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">Note: Speech recognition depends on browser support (Chrome / Edge recommended). The fuzzy matching uses normalization + a similarity threshold; adjust the threshold in code if you want it stricter or more forgiving.</div>
        </div>
        </div>      
      </>

  );
}
