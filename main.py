import os
import face_recognition
import cv2
import pickle
from datetime import datetime
import requests
from colorama import Fore, Style, init

init()

# Function to load images from subdirectories and create face encodings
def load_known_faces(root_directory):
    known_faces = []
    known_names = []
    for person_name in os.listdir(root_directory):
        person_dir = os.path.join(root_directory, person_name)
        if os.path.isdir(person_dir):
            for filename in os.listdir(person_dir):
                if filename.endswith(".jpg") or filename.endswith(".png"):
                    image_path = os.path.join(person_dir, filename)
                    image = face_recognition.load_image_file(image_path)
                    encodings = face_recognition.face_encodings(image)
                    if encodings:
                        known_faces.append(encodings[0])
                        known_names.append(person_name)
    return known_faces, known_names

# Function to check if new images have been added
def is_new_image_added(directory, last_check_time):
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            if file.endswith((".jpg", ".png")) and os.path.getmtime(file_path) > last_check_time:
                return True
    return False

# Function to save encoded faces
def save_encoded_faces(file_path, data):
    with open(file_path, 'wb') as f:
        pickle.dump(data, f)

# Function to load encoded faces
def load_encoded_faces(file_path):
    with open(file_path, 'rb') as f:
        return pickle.load(f)

# Load or process faces
cache_file = 'encoded_faces.pkl'
last_check_time = os.path.getmtime(cache_file) if os.path.exists(cache_file) else 0
if os.path.exists(cache_file) and not is_new_image_added('.', last_check_time):
    known_faces, known_names = load_encoded_faces(cache_file)
else:
    known_faces, known_names = load_known_faces('.')
    save_encoded_faces(cache_file, (known_faces, known_names))

# Function to recognise faces and save the image
def recognise_faces_and_save(test_image_path, output_image_path):
    test_image = face_recognition.load_image_file(test_image_path)
    face_locations = face_recognition.face_locations(test_image)
    face_encodings = face_recognition.face_encodings(test_image, face_locations)
    person_recognised = False

    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_faces, face_encoding)
        name = Fore.RED + "Unknown" + Style.RESET_ALL  # Red color for 'Unknown'
        if True in matches:
            first_match_index = matches.index(True)
            name = Fore.GREEN + known_names[first_match_index] + Style.RESET_ALL  # Green color for recognised names
            person_recognised = True

        cv2.rectangle(test_image, (left, top), (right, bottom), (0, 0, 255), 2)
        cv2.putText(test_image, name, (left + 6, bottom - 6), cv2.FONT_HERSHEY_DUPLEX, 1.0, (255, 255, 255), 1)

    cv2.imwrite(output_image_path, cv2.cvtColor(test_image, cv2.COLOR_RGB2BGR))

    if person_recognised:
        print(Fore.CYAN + "Querying API..." + Style.RESET_ALL)
        print(name)
        try:
            response = requests.get(f"http://45.87.28.51:5000/attendance?ID={name}&Location={location}&present=true")
            response.raise_for_status()
            print(Fore.YELLOW + f"API Response: {response.text}" + Style.RESET_ALL)
        except requests.RequestException as e:
            print(Fore.RED + f"API request failed: {e}" + Style.RESET_ALL)

location = "Owen"
test_subject = input(Fore.BLUE + "Enter Test File Name: " + Style.RESET_ALL)
output_path = "output.jpg"
recognise_faces_and_save(test_subject, output_path)