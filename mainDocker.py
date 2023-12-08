import os
import face_recognition
import cv2
import pickle
from datetime import datetime
import requests
from colorama import Fore, Style, init
import concurrent.futures
import numpy as np

init()

def get_webcam_device_numbers():
    try:
        with open("webcam_devices.txt", "r") as file:
            return [int(line.strip()) for line in file.readlines()]
    except Exception as e:
        print(f"Error reading webcam device numbers: {e}")
        return []

webcam_numbers = get_webcam_device_numbers()
if len(webcam_numbers) >= 2:
    video_capture1 = cv2.VideoCapture(webcam_numbers[0])
    video_capture2 = cv2.VideoCapture(webcam_numbers[1])
else:
    print("Insufficient webcams found. Exiting.")
    exit(1)

def load_face_encodings(image_path):
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)
    if len(encodings) == 1:
        return encodings[0]
    elif len(encodings) > 1:
        raise ValueError(f"More than one face found in image: {image_path}")
    return None


def load_known_faces(root_directory):
    known_faces = []
    known_names = []
    trained_files = []
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_image = {}
        for person_name in os.listdir(root_directory):
            person_dir = os.path.join(root_directory, person_name)
            if os.path.isdir(person_dir):
                for filename in os.listdir(person_dir):
                    if (
                        filename.endswith(".jpg")
                        or filename.endswith(".png")
                        or filename.endswith(".jpeg")
                    ):
                        image_path = os.path.join(person_dir, filename)
                        future = executor.submit(load_face_encodings, image_path)
                        future_to_image[future] = (person_name, image_path)

        for future in concurrent.futures.as_completed(future_to_image):
            encoding = future.result()
            person_name, image_path = future_to_image[future]
            if encoding is not None:
                known_faces.append(encoding)
                known_names.append(person_name)
                trained_files.append(image_path)
                print(f"Processed file: {image_path}")
            else:
                print(f"No valid face encoding found for file: {image_path}")

    return known_faces, known_names, trained_files


def is_new_image_added(directory, last_check_time):
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            if (
                file.endswith((".jpg", ".png", ".jpeg"))
                and os.path.getmtime(file_path) > last_check_time
            ):
                return True
    return False


def preprocess_image(image):
    for i in range(image.shape[2]):
        image[:, :, i] = cv2.equalizeHist(image[:, :, i])
    return image


def save_encoded_faces(file_path, data):
    with open(file_path, "wb") as f:
        pickle.dump(data, f)


def load_encoded_faces(file_path):
    with open(file_path, "rb") as f:
        return pickle.load(f)


cache_file = "encoded_faces.pkl"
last_check_time = os.path.getmtime(cache_file) if os.path.exists(cache_file) else 0
if os.path.exists(cache_file) and not is_new_image_added(".", last_check_time):
    known_faces, known_names = load_encoded_faces(cache_file)
else:
    known_faces, known_names, trained_files = load_known_faces(".")
    print(f"Trained against the following files: {trained_files}")
    save_encoded_faces(cache_file, (known_faces, known_names))

def recognise_faces_from_webcams():
    print(
        Fore.GREEN
        + f"Starting..."
        + Style.RESET_ALL
        ) 

    api_request_made = {}

    if not video_capture1.isOpened() or not video_capture2.isOpened():
        print("Error: Cannot access one or both webcams.")
        return

    try:
        print(Fore.GREEN+"Listening..."+Style.RESET_ALL)
        while True:
            ret1, frame1 = video_capture1.read()
            ret2, frame2 = video_capture2.read()
            
            for idx, (ret, frame, video_capture) in enumerate(
                [(ret1, frame1, video_capture1), (ret2, frame2, video_capture2)]
            ):
                if not ret:
                    print(f"Warning: Unable to read frame from webcam {idx}.")
                    continue

                processed_frame = preprocess_image(frame)
                face_locations = face_recognition.face_locations(processed_frame)
                face_encodings = face_recognition.face_encodings(
                    processed_frame, face_locations
                )
                faces_recognised = []
                for (top, right, bottom, left), face_encoding in zip(
                    face_locations, face_encodings
                ):
                    distances = face_recognition.face_distance(
                        known_faces, face_encoding
                    )
                    best_match_index = np.argmin(distances)
                    if distances[best_match_index] < 0.6:
                        name = known_names[best_match_index]
                        faces_recognised.append(name)
                        if name not in api_request_made:
                            api_request_made[name] = False

                        if not api_request_made[name]:
                            present = "true" if idx == 0 else "false"
                            print(
                                Fore.CYAN
                                + f"Querying API for camera {idx}..."
                                + Style.RESET_ALL
                            )
                            try:
                                response = requests.post(
                                    f"http://45.87.28.51:5000/attendance?id={str(name)}&Location=Owen&present={present}"
                                )
                                response.raise_for_status()
                                print(
                                    Fore.YELLOW
                                    + f"API Response: {response.text}"
                                    + Style.RESET_ALL
                                )
                                api_request_made[name] = True
                            except requests.RequestException as e:
                                print(
                                    Fore.RED
                                    + f"API request failed: {e}"
                                    + Style.RESET_ALL
                                )

                    else:
                        name = "Unknown"

                    cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
                    cv2.putText(
                        frame,
                        name,
                        (left + 6, bottom - 6),
                        cv2.FONT_HERSHEY_DUPLEX,
                        1.0,
                        (255, 255, 255),
                        1,
                    )


            for name in api_request_made.keys():
                if name not in faces_recognised:
                    api_request_made[name] = False

            if cv2.waitKey(1) & 0xFF == ord("q"):
                break

    except Exception as e:
        print(f"Error occurred: {e}")

    finally:
        video_capture1.release()
        video_capture2.release()

recognise_faces_from_webcams()
