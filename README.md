
# Face Recognition Project

This project implements a face recognition system using Python, OpenCV, and Docker. Follow these instructions to set up and run the project.

## Prerequisites

Before you begin, ensure you have Docker installed on your system. If not, you can download and install Docker from [Docker's official website](https://www.docker.com/get-started).

## Setup Instructions

1. **Install Docker**: 
   Follow the instructions on the Docker website to install Docker on your system.

2. **Pull the Base Docker Image**:
   This project uses the `orgoro/dlib-opencv-python` image as a base. Pull this image from Docker Hub:
   ```
   docker pull orgoro/dlib-opencv-python
   ```

3. **Clone the GitHub Repository**:
   Clone the FaceRecog project from GitHub:
   ```
   git clone https://github.com/harveygw/FaceRecog.git
   ```

4. **Configure Camera Devices**:
   Check the video device values for your webcams. You can list the video devices using:
   ```
   ls /dev/video*
   ```
   Note the device numbers (e.g., video0, video2) for your webcams.

   Open `mainDocker.py` and update the video capture device indices with the correct values for your setup.

5. **Build the Docker Image**:
   Navigate to the cloned repository and build the Docker image:
   ```
   cd FaceRecog
   docker build -t face-recog:latest .
   ```

6. **Run the Docker Container with Webcams**:
   Run the Docker container, ensuring to replace `/dev/video0` and `/dev/video2` with the correct device paths for your webcams:
   ```
   sudo docker run --device=/dev/video0:/dev/video0 --device=/dev/video2:/dev/video2 -e QT_QPA_PLATFORM=offscreen -it face-recog:latest
   ```

## Usage

After running the Docker container, the face recognition system will start processing images from the specified webcam devices.

