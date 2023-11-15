import os
import face_recognition
import cv2


# Function to load images from subdirectories and create face encodings
def load_known_faces(root_directory):
    known_faces = []
    known_names = []
    for person_name in os.listdir(root_directory):
        person_dir = os.path.join(root_directory, person_name)
        if os.path.isdir(person_dir):
            for filename in os.listdir(person_dir):
                if filename.endswith(".jpg") or filename.endswith(".png"):
                    # Load an image
                    image_path = os.path.join(person_dir, filename)
                    image = face_recognition.load_image_file(image_path)
                    # Get face encodings
                    encodings = face_recognition.face_encodings(image)
                    if encodings:
                        known_faces.append(encodings[0])
                        known_names.append(person_name)
    return known_faces, known_names


known_faces, known_names = load_known_faces(".")


# Function to recognize faces in an uploaded image
def recognize_faces(test_image_path):
    # Load the test image
    test_image = face_recognition.load_image_file(test_image_path)
    face_locations = face_recognition.face_locations(test_image)
    face_encodings = face_recognition.face_encodings(test_image, face_locations)

    for (top, right, bottom, left), face_encoding in zip(
        face_locations, face_encodings
    ):
        matches = face_recognition.compare_faces(known_faces, face_encoding)
        name = "Unknown"

        if True in matches:
            first_match_index = matches.index(True)
            name = known_names[first_match_index]

        cv2.rectangle(test_image, (left, top), (right, bottom), (0, 0, 255), 2)
        cv2.putText(
            test_image,
            name,
            (left + 6, bottom - 6),
            cv2.FONT_HERSHEY_DUPLEX,
            1.0,
            (255, 255, 255),
            1,
        )

    cv2.imshow("Image", cv2.cvtColor(test_image, cv2.COLOR_RGB2BGR))
    cv2.waitKey(0)
    cv2.destroyAllWindows()


recognize_faces("test.jpg")
