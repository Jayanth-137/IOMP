#!/bin/bash
# ML/start_ml.sh

# Start the Prediction Service (required.py) in the background
python required.py &

# Start the Crop Rotation Service (cropRotation.py) in the background
python cropRotation.py &

# Wait for any process to exit
wait -n
  
# Exit with status of process that exited first
exit $?