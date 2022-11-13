#Create a New React App

##Requirements:

_Node version >= 8.10_
_NPM version >= 5.6_

npx create-react-app app-name
cd app-name
npm start

**Setps to install likeminds sdk:**

-   npm install likeminds-sdk

-   import script and css files in index.js

    -import "likeminds-sdk/styles.css";
    -import "likeminds-sdk/likeminds-sdk.js";

-   Add likeminds sdk tag with configuration any reactjs component

    a: guest user
    <likeminds-web-sdk
    api-key="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx"
    user-unique-id="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx"
    is-guest="false"

    > </likeminds-web-sdk>

    b: loggedin user

    <likeminds-web-sdk
    api-key="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx"
    user-unique-id="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxx"
    is-guest="true"
    user-name="Test User"

    > </likeminds-web-sdk>
