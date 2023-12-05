# Use a Microsoft-hosted image with pre-installed Visual Studio Build Tools
FROM mcr.microsoft.com/dotnet/framework/sdk:4.8-windowsservercore-ltsc2019

# Install Python 3.8.10
ADD https://www.python.org/ftp/python/3.8.10/python-3.8.10-amd64.exe C:\\temp\\python-installer.exe
RUN C:\\temp\\python-installer.exe /quiet InstallAllUsers=1 PrependPath=1 Include_test=0

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install Python dependencies
RUN pip install -r requirements.txt

# Run main.py when the container launches
CMD ["python", "main.py"]
