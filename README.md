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

## Further work
1) Add methods to retreive actual coordinates (not just having red dot)

## Contributors

* [Christian Fries](https://github.com/christian-fries)
* [Christian Zürcher](https://github.com/jacktraror)
* [Loïc Rosset](https://github.com/LoRosset)
