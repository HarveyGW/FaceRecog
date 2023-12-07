# Use the dlib, OpenCV, and Python base image
FROM orgoro/dlib-opencv-python

#Set the working directory in the container
WORKDIR /usr/src/app

#Copy the current directory contents into the container at /usr/src/app
COPY . .

# Install any needed Python packages specified in requirements.txt
# Make sure requirements.txt does not include dlib or OpenCV as they're already installed
RUN python --version
RUN python -m pip install --no-cache-dir -r requirements.txt
RUN pip list
# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NAME World

# Run your Python script when the container launches
CMD ["python", "./mainDocker.py"]
