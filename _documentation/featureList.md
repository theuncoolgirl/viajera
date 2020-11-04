# FEATURES & User Stories
Clone of Sygic Travel, where users can save travel sites/attractions/etc and build travel itineraries.

MVP will allow users to utilize Google Maps API in order to create "cards" for specific points of interest, utilizing the Google Maps API, which they can save to personal lists (CRUD actions for both cards and lists). Additional bonus features will allow users to convert these lists into actual travel itineraries (i.e. order items, assign date/times, generate recommended order based on smallest amount of necessary travel between locations, etc). Further additional bonus features may include things like allowing multiple users to collaborate on a single list or itinerary, or generate a link that an unauthorized user can view without being logged in. 

MVP Features, User Stories, and Data Schema are outlined below, along with some stretch goals/features that I hope to eventually incorporate.

## Features - MVP
- [ ] Site-wide navigation element
- [ ] Homepage that includes information about the site and link to signup/login.
- [ ] Authentication - sign up with username/email/password, login/logout, demo user login. If user tries to navigate to protected portions of site, will be redirected to login/signup.
- [ ] Search functionality for looking up points of interest using Google Maps API. 
- [ ] Integration with Google Maps API that allows users to create, view, update, and delete "cards" for specific points of interest (CRUD). Once a user has saved a given location, this can be viewed by any user and will appear as a flagged point on the map. 
- [ ] Ability to save points of interest to specific lists (CRUD for lists).
- [ ] Landing page that user is directed to upon login that defaults to view of map of current location, with nearby locations.  

## Backlog
- [ ] Convert a "list" of places into an itinerary, which would include items in a specific order, time/date information. 
- [ ] Display route between items in itinerary on map. 
- [ ] "Recommended itinerary" feature that will optimize an itinerary based on smallest amount of travel time between places. 
- [ ] Add photos to itinerary items. 
- [ ] Public/private feature for lists and itineraries
- [ ] Share collaboration permissions on lists/itineraries with other users. 
- [ ] Generate a link to an itinerary that a unauthorized user can view without logging in. 
- [ ] Generate list or route on Google Maps that corresponds to lists and itineraries. 
- [ ] "Travel Log" where details/photos of completed itinerary items can be viewed.
- [ ] Darkmode

## User Stories
1. As an unauthorized user, I want to view a home page that provides me with information about the site, and the ability to log in.
    - Acceptance Criteria:
        - [ ] User can visit the `/` path and will be served a homepage/landing page that provides information about the site, a navigation bar & log-in form, and a link to sign-up if necessary.
1. As an unauthorized user, I want to be able to sign up for the website via a signup form in order to access protected content.
    - Acceptance Criteria:
        - [ ] User can visit the `/sign-up` path and will be served a form asking for a name, email, and password.
        - [ ] After user enters valid information for all fields, a new user row is added to the User table, and user is directed to a login page.
        - [ ] If a user enters invalid sign-up information, they receive a message specific to the information that is incorrect.
        - [ ] If a user enters an email that is already in use for another user, they receive a message indicating such, with a link to `/log-in`
        - [ ] Session should last 1 day
1. As an unauthorized user, I want to be able to login to the website, via a form, in order to access my private information.
    - Acceptance Criteria
        - [ ] User can visit the `/` path and will be served a form on the homepage requesting email and password, along with link to sign-up page.
        - [ ] After user enters valid login information, the user is redirected to an "explore page at `/explore` that defaults to their current location. 
        - [ ] After user successfully logs in, a session is created with the necessary cookies/etc.
        - [ ] If a user enters incorrect log-in information, they receive an error message.
1. As an authorized user, I want to be able to log out of the application in order to protect my private information.
    - Acceptance Criteria
        - [ ] From any page on the site, the user can click a "Log out" link, which will manually delete their session cookie (logging them out), and redirecting them to the `/` homepage.
1. As an authorized user, I want a clear and consistent way to navigate across the site.
    - Acceptance Criteria
        - [ ] Every page has a consistent navigation display containing:
            - Login/Logout button depending on login status
            - Search Bar
            - Homepage `/`
            - My Lists
            - My Itineraries 
1. As an authorized user, I want to be able to view points of interests generated by other users and to create my own, in order to ultimately organize them into lists to help me plan for travel. 
        - [ ] User can use search bar or manually search on map for points of interest (POI). 
        - [ ] Clicking on a POI on the map will open up a sidebar with additional information about the POI pulled from the Google Maps API: name, rating, location type, address, operating hours, website, contact info (phone), photos, reviews. 
        - [ ] POI that have been previously saved by other users will be flagged on the map and can be saved by the current user. 
        - [ ] POI that has not been previously saved by other users can be added and saved by current user. 
1. As an authorize user, I want to be able to add a point of interest (POI) to a specific list, so that I can better organize my saved POIs. 
        - [ ] Users can click on a "Add to List" button, which will add current viewed POI, including optional notes and photos, to a specific user list, and a create corresponding row to the "Lists" database table.
        - [ ] Once a user clicks on the "Add to List" button, it will update to a "Remove from List" button that the user can click on to delete that record from the table.
        - [ ] Users can generate a new list if they do not want to save a POI to an already-created list. 
1. As an authorized user, I want to be able to navigate to "My Lists" to view the details of my saved lists along with all associated POIs.
    - Acceptance Criteria
        - [ ] User can view a list of all saved lists at `/lists`.
        - [ ] User can view specifics of a given list at `/lists/:id`.

## Data Schema
Most data for the setlist.fm clone will be pulled from the setlist.fm API, but app will require the following data to be stored in its database:

1. Users
    - username
    - email
    - password hash
1. Places
    - createdBy (belongsTo Users.id)
    - lat
    - long
1. Lists
    - userId (belongsTo Users.id)
    - name
    - description
1. List Entries
    - placeId (belongsTo Places.id)
    - listId (belongsTo Lists.id)
    - notes
1. List Entry Photos
    - listEntryId (belongsTo ListEntires.id)
    - imgURL

Bonus Features
1. Itineraries
    - userId (belongsTo Users.id)
    - name
    - description
1. Itinerary Entries
    - itineraryId (belongsTo Itineraries.id)
    - entryType (place, travelDetail, or note)
    - placeId (belongsTo Places.id)
    - order
    - notes
    - timestamp
1. Itinerary Entry Photos
    - itineraryEntryId (belongsTo ItineraryEntires.id)
    - imgURL

## Frontend Routes
- `/` Home/Landing Page
- `/login` Login
- `/signup` Signup
- `/explore` Explore Page (map, defaults to current location)
- `/lists` All lists
- `/lists/${id}` List detail page

## Backend Routes
- `/` Home/Landing Page
- `/api/users/signup` Signup Page [GET, PUT]
- `/api/users/login` Login Page [GET, PUT]
- `/api/users/logout` Link to Logout, redirects to homepage [GET]
- `/api/places/add` [POST] Create place/poi card
- `/api/lists/create` [POST] Create a new list
- `/api/lists/delete` [DELETE] Delete a list
- `/api/listentries/add` [POST] Create a new entry, adding an entry to a list
- `/api/listentries/remove` [DELETE] Delete an entry, removing it from a list

## Components
Components to be organized as follows:
- Root
    - App
        - NavBar
            - Search
        - Main Component
        - Footer

The following components will render in between `NavBar` and `Footer` for their corresponding pages:
TBD

## State Shape
TBD
