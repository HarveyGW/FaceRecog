#!/bin/bash

RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m' 

echo """

███████╗░█████╗░░█████╗░███████╗  ██████╗░███████╗░█████╗░░█████╗░░██████╗░
██╔════╝██╔══██╗██╔══██╗██╔════╝  ██╔══██╗██╔════╝██╔══██╗██╔══██╗██╔════╝░
█████╗░░███████║██║░░╚═╝█████╗░░  ██████╔╝█████╗░░██║░░╚═╝██║░░██║██║░░██╗░
██╔══╝░░██╔══██║██║░░██╗██╔══╝░░  ██╔══██╗██╔══╝░░██║░░██╗██║░░██║██║░░╚██╗
██║░░░░░██║░░██║╚█████╔╝███████╗  ██║░░██║███████╗╚█████╔╝╚█████╔╝╚██████╔╝
╚═╝░░░░░╚═╝░░╚═╝░╚════╝░╚══════╝  ╚═╝░░╚═╝╚══════╝░╚════╝░░╚════╝░░╚═════╝░
"""

# Function to display a title
display_title() {
    title="$1"
    border=$(printf '%*s\n' "${COLUMNS:-$(tput cols)}" '' | tr ' ' '-')
    echo ""
    echo -e "$title"
    echo -e "${CYAN}$border"
}

# Function to execute a command and check its success
execute_command() {
    echo -e "${YELLOW}Executing: $1...${NC}"
    bash -c "$1" &> /dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Success${NC}"
    else
        echo -e "${RED}Error occurred during execution. Exiting...${NC}"
        exit 1
    fi
}

# Check if the script is run as root
display_title "🇨​​​​​ 🇭​​​​​ 🇪​​​​​ 🇨​​​​​ 🇰​​​​​ 🇮 ​​​​​🇳 ​​​​​🇬​​​​​  🇪​​​​​ 🇽​​​​​ 🇪​​​​​ 🇨​​​​​ 🇺 ​​​​​🇹 ​​​​​🇮​​​​​ 🇴​​​​​ 🇳​​​​​  🇵 ​​​​​🇷​​​​​ 🇮​​​​​ 🇻​​​​​ 🇮 ​​​​​🇱 ​​​​​🇪​​​​​ 🇬 ​​​​​🇪 ​​​​​🇸​​​​​"
if [ "$(id -u)" != "0" ]; then
    echo -e "${RED}Error: This script must be run as root. Use 'sudo ./runner.sh'.${NC}"
    exit 1
else
    echo -e "${GREEN}Success${NC}"
fi

# Installing Docker
display_title "🇮​​​​​ 🇳​​​​​ 🇸​​​​​ 🇹​​​​​ 🇦​​​​​ 🇱​​​​​ 🇱​​​​​ 🇮​​​​​ 🇳​​​​​ 🇬​​​​​  🇩​​​​​ 🇴​​​​​ 🇨​​​​​ 🇰​​​​​ 🇪​​​​​ 🇷​​​​​​​​​​"
execute_command "apt-get update"
execute_command "apt-get install -y docker.io"
execute_command "systemctl start docker.service"

# Installing ffmpeg
display_title "🇮​​​​​ 🇳​​​​​ 🇸​​​​​ 🇹​​​​​ 🇦​​​​​ 🇱​​​​​ 🇱​​​​​ 🇮​​​​​ 🇳​​​​​ 🇬​​​​​  🇫​​​​​ 🇫​​​​​ 🇲​​​​​ 🇵​​​​​ 🇪​​​​​ 🇬​​​​​"
execute_command "apt-get install -y ffmpeg"

# Function to check for raw video devices
check_for_raw_video() {
    ffmpeg -f v4l2 -list_formats all -i "$1" 2>&1 | grep -q "Raw"
}

video_devices=()

# Discovering webcams
display_title "🇩​​​​​ 🇮​​​​​ 🇸​​​​​ 🇨​​​​​ 🇴​​​​​ 🇻​​​​​ 🇪​​​​​ 🇷​​​​​ 🇮​​​​​ 🇳​​​​​ 🇬​​​​​  🇨​​​​​ 🇴​​​​​ 🇳​​​​​ 🇳​​​​​ 🇪​​​​​ 🇨​​​​​ 🇹​​​​​ 🇪​​​​​ 🇩​​​​​  🇼​​​​​ 🇪​​​​​ 🇧​​​​​ 🇨​​​​​ 🇦​​​​​ 🇲​​​​​ 🇸​​​​​"
echo -e "${YELLOW}Searching for connected webcams...${NC}"
for dev in /dev/video*; do
    if check_for_raw_video "$dev"; then
        echo -e "${BLUE}Raw video device found: $dev${NC}"
        video_devices+=("$dev") # Add device to array
    fi
done

# File to store webcam device numbers
webcam_devices_file="webcam_devices.txt"

# Write detected webcam device numbers to a file
echo -n "" > $webcam_devices_file
for dev in "${video_devices[@]}"; do
    echo "${dev##*/dev/video}" >> $webcam_devices_file
done

# Building Docker Image
display_title "🇧​​​​​ 🇺​​​​​ 🇮​​​​​ 🇱​​​​​ 🇩​​​​​ 🇮​​​​​ 🇳​​​​​ 🇬​​​​​  🇩​​​​​ 🇴​​​​​ 🇨​​​​​ 🇰​​​​​ 🇪​​​​​ 🇷​​​​​  🇮​​​​​ 🇲​​​​​ 🇦​​​​​ 🇬​​​​​ 🇪​​​​​"
execute_command "docker build -t face-recog:latest ."

# Constructing Docker Run Command
echo -e "${YELLOW}Preparing to run the Docker container...${NC}"
docker_run_command="docker run"
for dev in "${video_devices[@]}"; do
    docker_run_command+=" --device=$dev:$dev"
done
docker_run_command+=" -e QT_QPA_PLATFORM=offscreen -it face-recog:latest"

# Running Docker Container
display_title "🇷​​​​​ 🇺​​​​​ 🇳​​​​​ 🇳​​​​​ 🇮​​​​​ 🇳​​​​​ 🇬​​​​​  🇩​​​​​ 🇴​​​​​ 🇨​​​​​ 🇰​​​​​ 🇪​​​​​ 🇷​​​​​  🇨​​​​​ 🇴​​​​​ 🇳​​​​​ 🇹​​​​​ 🇦​​​​​ 🇮​​​​​ 🇳​​​​​ 🇪​​​​​ 🇷​​​​​"
echo -e "${YELLOW}Starting container...${NC}"
eval $docker_run_command
