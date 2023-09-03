#!/bin/bash
host="192.168.1.100"  # Replace with the IP address of your device
port=3000             # Replace with the port you want to measure

while true; do
    result=$(nc -z -w1 $host $port 2>&1)
    echo "Port $port on $host: $result"
    sleep 60  # Adjust the interval as needed
done
