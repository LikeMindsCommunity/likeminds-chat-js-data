# Devloper Changelog

- This is the developers daily changelog

## [2020-10-05] - Bhupendra Singh

### Added
- Integrated community detail API
- Integrated generate Otp and verify Otp API
- Changelog file for releases
- Changelog for developers

## [2020-10-04] - Bhupendra Singh

### Added
- Google, Facebook and LinkedIn login feature
- Updated environment file for social keys
- Deleted OTP input component and added pakage to handle otp form
- NGRX router store to manage route state of app
- Store Service to subscribe actions in component
- Community guard for unauthorized access to community detail
- Store mobile, country code and before login

## [2020-10-03] - Bhupendra Singh

### Added
- Added read more component with to show ..., if text is long
- Ellipsis pipe to transform long text
- Component for country code list dropdown
- Service, action, effect to get community detail
- Added counter for 30 seconds
- Countdown pipe to format counter

### Changes
- Header UI
- Updated header.json file for more generateOtp and verifyOtp header

## [2020-10-02] - Bhupendra Singh

### Added
- Resize service and component to detect screen size change
- Country code JSON and service, effect, action and reducer to get country code in component
- Privacy service, effect, action and reducer to get privacy data in component

### Changes
- Removed package to get county code and verify mobile number
- Changed generate/verify otp component to pages

## [2020-10-01] - Bhupendra Singh

### Added
- Added number only directive to input only number in field
- Selector to get default country code from store
- Updated language file
- OTP input component for otp form

### Refactor and Fixed
- Removed extra HTML and CSS in generate otp component and login component
- Fixed bugs in base header template

## [2020-09-30] - Bhupendra Singh

### Added
- Community detail component and routing
- Community questions component and routing
- Added constant file for routes
- Installed package to get country code list and verify mobile number
- Create profile module and UI
- Server side rendering (SSR) setup

### Changes
- Seperate components for generate and verify otp form

### Fixed
- Generate otp UI

## [2020-09-29] - Bhupendra Singh

### Changes
- Added core module and moved services and interceptor to core modules

### Added
- app services, action and reducer
- selector to fetch header details from store
- Community layout module and routing

## [2020-09-28] - Bhupendra Singh

### Added
- Login component
- Generate otp UI

## [2020-09-26] - Bhupendra Singh

### Added
- Set up NGRX for state management
- Added service, model, action effect and reducer for generate API, verify API,
  login API, merge account API, community question API, memeber state API,
  join community API and member list API
- Base service to be extended in all other service to use common methods

## [2020-09-25] - Bhupendra Singh

### Added
- Privacy page component and routing for privacy page
- Updated environment file with base url to be used
- Http interceptor to intercept request/response from server

### Fixed
- Home page UI
- Terms and privacy page responsiveness

## [2020-09-24] - Bhupendra Singh

### Added
- Home page UI
- WIP: Animations on home page

## [2020-09-23] - Bhupendra Singh

### Added
- Header component and service to get data for header
- Terms and conditions UI
- Added JSON file for terms and fetch tems page data using service

## [2020-09-22] - Bhupendra Singh

### Added
- Home module
- Events Module
- Page not found module
- Routing and UI of Page not found
- WIP: Terms and condition module

## [2020-09-21] - Bhupendra Singh
- Initial project setup