import speech_recognition as sr
import pyttsx3
import requests

engine = pyttsx3.init()
r = sr.Recognizer()

API_URL = "http://127.0.0.1:8000/chat"

while True:
    with sr.Microphone() as source:
        print("Listening...")
        engine.say("Ask your question sir")
        engine.runAndWait()

        audio = r.listen(source)

    try:
        text = r.recognize_google(audio)
        print("You said:", text)

        engine.say("You said " + text)
        engine.runAndWait()

    except sr.UnknownValueError:
        engine.say("Sorry, I could not understand")
        engine.runAndWait()
        continue

    except sr.RequestError:
        print("API unavailable")
        continue

    response = requests.post(API_URL, json={"text": text})
    answer = response.json()["response"]

    print("AI:", answer)

    engine.say(answer)
    engine.runAndWait()

    again = input("wanna ask more? (1/0): ")
    if again == "0":
        break