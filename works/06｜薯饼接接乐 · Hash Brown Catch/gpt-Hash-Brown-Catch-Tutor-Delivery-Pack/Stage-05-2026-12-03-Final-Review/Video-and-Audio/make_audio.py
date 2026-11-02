from pathlib import Path
import wave
import numpy as np

SR=48000
DURATION=36
rng=np.random.default_rng(5913)
N=SR*DURATION
music=np.zeros(N,dtype=np.float64)
sfx=np.zeros(N,dtype=np.float64)

def freq(midi): return 440*2**((midi-69)/12)
def add(dst,start,data,gain=1):
    first=max(0,int(start*SR));last=min(len(dst),first+len(data))
    if last>first: dst[first:last]+=data[:last-first]*gain

def note(midi,duration,kind='bell'):
    t=np.arange(int(duration*SR))/SR;f=freq(midi)
    attack=np.minimum(1,t/.006)
    release=np.minimum(1,np.maximum(0,duration-t)/.045)
    if kind=='chip':
        v=sum(np.sin(2*np.pi*f*k*t)/k for k in [1,3,5,7])/1.5
        env=attack*release*np.exp(-t*4)
    elif kind=='bass':
        v=np.sin(2*np.pi*f*t)+.15*np.sin(2*np.pi*f*2*t)
        env=attack*release*np.exp(-t*5)
    else:
        v=np.sin(2*np.pi*f*t)+.28*np.sin(2*np.pi*f*2*t)+.1*np.sin(2*np.pi*f*3*t)
        env=attack*release*np.exp(-t*5)
    return v*env

beat=60/112
chords=[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,67]]
melody=[76,None,79,76,74,None,72,74,76,None,79,81,79,None,76,74,
        72,None,76,74,72,None,69,72,74,None,76,74,71,None,67,71]
for step in range(int(DURATION/(beat/2))+1):
    at=step*beat/2
    if at>=DURATION: break
    chord=chords[(step//8)%4]
    arp=chord[[0,2,1,3][step%4]]+12
    add(music,at,note(arp,.20,'chip'),.018)
    m=melody[step%len(melody)]
    if m: add(music,at,note(m,.25,'bell'),.055)
    if step%2==0: add(music,at,note(chord[0]-24,.34,'bass'),.075)
    # Quiet, soft 8-bit percussion rather than a busy arcade soundtrack.
    noise=rng.normal(0,1,int(.035*SR));noise*=np.exp(-np.arange(len(noise))/(SR*.007))
    add(music,at,noise,.008)
    if step%4==0:
        t=np.arange(int(.12*SR))/SR
        kick=np.sin(2*np.pi*(65*t+14*(1-np.exp(-t*30))/30))*np.exp(-t*30)
        add(music,at,kick,.055)

def crunch(at):
    t=np.arange(int(.13*SR))/SR
    n=rng.normal(0,1,len(t));n=n-np.convolve(n,np.ones(7)/7,mode='same')
    add(sfx,at,n*np.exp(-t*34),.12)
    add(sfx,at,note(88,.09,'bell'),.045)

for at in [5.30,6.20,7.10,8.00,8.90,9.70,11.60,23.00]: crunch(at)
# Opening sparkle and game-start chime.
for i,m in enumerate([72,76,79]): add(sfx,.12+i*.075,note(m,.25),.07)
for i,m in enumerate([72,76,79,84]): add(sfx,3.12+i*.06,note(m,.2),.065)
# A little squish when the potato misses the basket.
t=np.arange(int(.26*SR))/SR
phase=2*np.pi*np.cumsum(150*np.exp(-t*6))/SR
add(sfx,10.68,np.sin(phase)*np.exp(-t*14),.16)
add(sfx,10.7,rng.normal(0,1,len(t))*np.exp(-t*25),.018)
# Clock, coffee and cola get different little voices.
for i,m in enumerate([84,91]): add(sfx,14.80+i*.065,note(m,.22),.09)
for i,m in enumerate([67,71,74,79]): add(sfx,16.60+i*.045,note(m,.13,'chip'),.07)
for i,m in enumerate([79,86,91]): add(sfx,18.56+i*.055,note(m,.2),.075)
# Rare-pup coin fanfare and a little shop click.
for i,m in enumerate([79,84,88,91,96]): add(sfx,21.65+i*.085,note(m,.32),.10)
for i,m in enumerate([84,88,91]): add(sfx,24.08+i*.045,note(m,.18),.055)
for i,m in enumerate([76,79,84]): add(sfx,31.15+i*.12,note(m,.48),.065)

time=np.arange(N)/SR
duck=np.ones(N)
duck[(time>21.5)&(time<22.5)]=.55
master=music*duck+sfx
fade=np.minimum(1,time/.15)*np.minimum(1,np.maximum(0,DURATION-time)/.8)
master=np.tanh(master*1.2)*fade
stereo=np.stack([master*.98,np.roll(master,35)*.98],axis=1)
out=Path(__file__).resolve().parent / 'Original-Music-and-SFX.wav'
with wave.open(str(out),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
    w.writeframes((np.clip(stereo,-.98,.98)*32767).astype('<i2').tobytes())
print(f'Original music and effects: {out}; peak {np.max(np.abs(stereo)):.3f}')
