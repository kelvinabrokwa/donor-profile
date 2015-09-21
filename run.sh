#!/usr/bin/env bash
rm -rf graphics charts
mkdir graphics charts

echo 'Creating bar charts...'
node bars_viz.js
echo 'Creating bubble charts...'
node bubble_viz.js
echo 'Creating radar charts...'
node radar_data.js | python3 radar.py
echo  'Creating quartile charts..'
node quartile_viz.js

echo 'Converting to PNG...'
for image in graphics/*; do
  if [[ $image == *"svg"* ]];
  then
    echo 'converting -> '$(basename $image);
    convert $image charts/`echo $(basename $image) | sed s/svg$/png/`;
  else
    mv $image charts;
  fi
done

rm -rf graphics
echo 'DONE! Your charts in the ./charts directory'
