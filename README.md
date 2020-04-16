# MMI2020-TobiiEyeCS

This repository contains part of the code for the mini project developed during the course Multimodal User Interfaces 2020 consisting of a eye tracking client and server (based on the Tobii EyeX).

## Requirements

This software only works on Windows machines. To use it, you need a Tobii-EyeX and the corresponding Tobii-Eyetrcking framework (https://gaming.tobii.com/getstarted/) installed. If required, also install Visual Studio with _.NET desktop development_.

## Integration
With the following addition, you will get a red dot that symbolizes the position of the eye gaze.
```
<html>
    <body>
        ...
        <div id="indicator" style="width:10px; height:12px; background-color:red; position:fixed; border-radius: 5px;"></div>
        <script type="text/javascript" src="./js/TobiiEyeClient.js"></script>
        ...
    </body>
</html>    
```

## Debug mode
When no TobiiEye server is found, the script changes to debug mode and uses the mouse position as eye coordinates.

## Use coordinates
To the eye coordinates, you can fetch them with the method `getLastCoords()` which returns a two-sized array with the last recorded x and y coordinates.

## Contributors

* [Christian Fries](https://github.com/christian-fries)
* [Christian Zürcher](https://github.com/jacktraror)
* [Loïc Rosset](https://github.com/LoRosset)
