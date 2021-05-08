import speech_recognition as sr
import sys
location=sys.argv[1]
r = sr.Recognizer()
file_audio = sr.AudioFile(location)
with file_audio as source:
    audio_text = r.record(source)
try:
    print(r.recognize_google(audio_text))
except:     # Could not understand audio
    print(0)