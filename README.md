## App deployed on firebase is accessible at below link: 
###        https://gradebookapp-e1167.web.app/




#### Step 1: Create react universal app with expo stack using tamagui
```bash
npx create-expo-stack@latest
```
#### Step 2: Install Dependencies
These packages provide the core functionality we need:
```bash
npm install --save firebase @expo/metro-runtime
```
- `firebase`: The core Firebase SDK for interacting with Firebase services
- `@expo/metro-runtime`: Enables proper web support for our Expo app

#### Step 3: Install Firebase CLI and Login
The Firebase CLI allows us to interact with our Firebase project from the command line:
```bash
npm install -g firebase-tools
firebase login
```

#### Step 4: Initialize Firebase in Your Project
This step sets up Firebase Hosting and creates necessary configuration files: This creates firebase.json with hosting configuration
```bash
firebase init hosting
```

#### Step 5: Build for web and deploy the build to firebase
This step sets up Firebase Hosting and creates necessary configuration files:
```bash
npx expo export -p web
firebase deploy
```
