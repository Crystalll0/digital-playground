"""Synthesises every sound effect in assets/sfx/ from scratch (no samples).
Run:  python3 tools/make_sfx.py      (needs numpy)
"""
import os, wave
import numpy as np

SR = 22050
OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "sfx")
rng = np.random.default_rng(7)

def save(name, x):
    x = np.clip(x, -1, 1); x = x / (np.max(np.abs(x)) + 1e-9) * 0.85
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())

def t(d): return np.arange(int(SR * d)) / SR
def env(n, a=0.005, dec=0.1):
    tt = np.arange(n) / SR
    return np.minimum(1, tt / max(a, 1e-4)) * np.exp(-np.maximum(0, tt - a) / dec)
def tone(f0, f1, d, shape="sine", dec=0.15, a=0.004):
    tt = t(d); f = np.linspace(f0, f1, len(tt)); ph = 2 * np.pi * np.cumsum(f) / SR
    y = {"sine": np.sin(ph), "square": np.sign(np.sin(ph)) * 0.5, "tri": 2 / np.pi * np.arcsin(np.sin(ph))}[shape]
    return y * env(len(tt), a, dec)
def bp(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); X[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(X, len(x))
def place(total, parts):
    out = np.zeros(int(SR * total))
    for st, x in parts:
        i = int(st * SR); n = min(len(x), len(out) - i); out[i:i + n] += x[:n]
    return out
def noise(d): return rng.standard_normal(int(SR * d))

# crunch: four crackly noise bursts
parts = [(st, bp(noise(0.07), 1800, 7000) * env(int(SR * 0.07), 0.001, 0.018 + 0.004 * k) * (1 - 0.15 * k))
         for k, st in enumerate([0, 0.035, 0.07, 0.115])]
parts.append((0, bp(noise(0.12), 300, 1200) * env(int(SR * 0.12), 0.001, 0.03) * 0.6))
save("crunch", place(0.22, parts))
# squelch "pu-ji" + a small sigh
pu = tone(320, 70, 0.25, "sine", 0.09) + bp(noise(0.25), 100, 600) * env(int(SR * 0.25), 0.002, 0.05) * 0.6
sigh = bp(noise(0.5), 400, 1400) * np.sin(np.linspace(0, np.pi, int(SR * 0.5))) * 0.12
save("squelch", place(0.95, [(0, pu), (0.13, tone(500, 180, 0.12, "tri", 0.05) * 0.5), (0.42, sigh)]))
save("ding", place(0.6, [(0, tone(988, 988, 0.5, "sine", 0.18)), (0.08, tone(1319, 1319, 0.5, "sine", 0.2) * 0.8)]))
save("bonk", place(0.35, [(0, tone(220, 110, 0.3, "square", 0.07)), (0, bp(noise(0.1), 200, 900) * env(int(SR * 0.1), 0.001, 0.02))]))
save("boom", place(0.9, [(0, bp(noise(0.9), 30, 700) * env(int(SR * 0.9), 0.002, 0.22)), (0, tone(140, 35, 0.6, "sine", 0.2) * 0.9)]))
save("golden", place(0.7, [(i * 0.06, tone(f, f, 0.35, "square", 0.09) * 0.5) for i, f in enumerate([1047, 1319, 1568, 2093])]))
save("slow", place(0.7, [(0, tone(900, 220, 0.6, "tri", 0.4) * 0.7)]))
tick = lambda: bp(noise(0.04), 2000, 8000) * env(int(SR * 0.04), 0.0005, 0.006)
save("clock", place(0.6, [(0, tick()), (0.12, tick()), (0.24, tone(1568, 1568, 0.35, "sine", 0.12))]))
save("tick", tone(880, 880, 0.08, "square", 0.02) * 0.5)
save("combo", place(0.45, [(i * 0.05, tone(f, f, 0.2, "square", 0.06) * 0.5) for i, f in enumerate([784, 988, 1175, 1568])]))
mel = [(0, 784), (0.15, 659), (0.3, 523), (0.5, 659), (0.65, 784), (0.8, 1047)]
save("timesup", place(1.5, [(st, tone(f, f, 0.35 if i < 5 else 0.7, "square", 0.12 if i < 5 else 0.3) * 0.45) for i, (st, f) in enumerate(mel)]))
save("click", tone(1200, 900, 0.05, "square", 0.015) * 0.4)

# --- added in week 3: easter egg and shop sounds ---
def arf(f):
    d = 0.16; tt = t(d); fr = np.interp(tt, [0, 0.03, d], [f * 0.8, f * 1.25, f * 0.6]); ph = 2 * np.pi * np.cumsum(fr) / SR
    y = np.sign(np.sin(ph)) * 0.4 + np.sin(2 * ph) * 0.3
    return bp(y + rng.standard_normal(len(tt)) * 0.25, 250, 3500) * env(len(tt), 0.01, 0.05)
snick = [(0.42 + i * 0.09, tone(700 - i * 60, 560 - i * 60, 0.07, "square", 0.03) * 0.35) for i in range(3)]
save("dog", place(0.8, [(0, arf(420)), (0.2, arf(380))] + snick))
n = noise(0.35); save("poof", bp(n, 300, 3000) * np.sin(np.linspace(0, np.pi, len(n))) ** 2 + tone(200, 600, 0.35, "sine", 0.15) * 0.3)
save("buy", place(0.6, [(0, bp(noise(0.05), 3000, 9000) * env(int(SR * 0.05), 0.0005, 0.01)), (0.05, tone(1568, 1568, 0.25, "square", 0.06) * 0.5), (0.12, tone(2093, 2093, 0.45, "square", 0.12) * 0.5)]))
save("equip", place(0.25, [(0, tone(660, 660, 0.08, "square", 0.03) * 0.5), (0.07, tone(990, 990, 0.12, "square", 0.05) * 0.5)]))

print("sound effects written to", os.path.abspath(OUT))
