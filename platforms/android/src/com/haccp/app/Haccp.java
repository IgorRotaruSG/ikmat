package com.haccp.app;
import android.app.Application;

//import com.testflightapp.lib.TestFlight;

public class Haccp extends Application { 

    @Override 
       public void onCreate() { 
           super.onCreate(); 
           // leave this uncommented on production
           //TestFlight.takeOff(this, "7157784a-1c3d-4fbd-9cb5-793b9c50ccf3");
       }
} 