# How to view the console in Xcode

As you've probably already noticed, if you use `console.log` when running a
React Native app in the iOS Simulator, you won't see the output printed to your
terminal by default. With React Native and iOS, the console lives inside Xcode.
Follow these instructions to view the terminal.

1. Open the folder containing your project. You should see an `ios/` folder
   inside of it. Double-click that to open it:

<img src="https://cl.ly/2i3F2p3j2j13/step%201.png">

1. Inside of this you should see a file with a blue xcode icon that ends in
   `.xcodeproj` (its name depends on what you named your project when you
   created it) -- double click this file to open the project in Xcode.

<img src="https://cl.ly/2k133Z2D3r3y/step%202.png">

1. Once you've got the project open in Xcode, you should see something like
   this. Click this button at the top-right corner to reveal the console. (Note
   that this happens automatically when you run your project!)

<img src="https://cl.ly/12150H2X0U0f/step%203.png">

1. You should see the console revealed below, but it's pretty tiny. Click the
   tiny blue bar icon at its bottom right corner to make it larger:

<img src="https://cl.ly/0f281y35051X/step%204.png">

1. You can click these other layout icons at the top right corner to make even
   more room for the console (they hide panels that you don't need to use right
   now in Xcode), then click and drag on the horizontal divider bar at the
   middle of the screen to make the terminal even larger:

<img src="https://cl.ly/0b2F1v0E1O3d/step%205.png">

1. Finally, now that you've got Xcode open, you can also run your project
   directly inside Xcode. Just hit the big "play" icon at the top left corner to
   start (or restart) your app. You can do this instead of running `react-native
   run-ios` in your console. This will open the simulator and the packager in a
   terminal window, if they're not already running:

<img src="https://cl.ly/390k3c1j2n05/step%206.png">



Happy coding! ✌️
