# 3ayez Github

BundleID: com.ayez.ayezcustomer
<a href="https://itunes.apple.com/us/app/3ayez-%D8%B9%D8%A7%D9%8A%D8%B2/id1329892544?mt=8"><br>iOS</a> | <a href="https://play.google.com/store/apps/details?id=com.ayez.ayezcustomer&hl=ar">Android</a>

---

### New in Version 2.0 (Apr 26 2018)
improved user experience
customizable categories by store
faster item searching
search recommendations

---

### Overview
Enable customers to request local deliveries from our network of grocers.

---

### App Outline
view Sketch folder for detailed mockups


#### Local Store Search
fetch grocers that contains the user's location within their respective delivery zones
default current location & allow user to manually change
rank stores by proximity
require login upon ordering, not before store browsing

display for each store:
- store name + image
- tagline (if available)
- number of users (audience) for social reinforcement
- distance from location
note: make cells large; there should only be a few results per neighborhood


#### Store's Homepage
'storefront' emphasizes:
1) powerful search over its items,
2) relevant homepage items, where promotions, item popularity, and personal order history manipulate ranking

horizontal category containers can be curated by each store (see screenshot below)
if the customer has ordering history with the store, 'Recently Ordered' defaults top.


#### Item Search
items live search with every inputted character (rely on Algolia)
debounce live search by 600ms to lower excessive calls
when no query is present, provide suggestions (most common search queries from the store within 48hrs)

'add custom item' within the footer of the item results grid


#### Basket
overview of the order - with total price, savings, and item count
login & account creation takes place at this step
core functionality:
- edit item quantities
- set address
- provide errand notes
- apply coupon
- clear order
- call store for questions
* no payment integration yet - all transactions are fulfilled offline


#### Order Tracking
realtime listen for changes on orders that
A) havent been sent yet, or B) have been sent out within the past 4 hours

link from store homepage to track current order
core functionality:
- order status indicator (should dominate the view)
- call store for questions
- cancel order up until the order has been sent
- other order details, including items, order ID, and time of order


#### Settings & Account Management
core functionality:
- login/logout
- order history
- editing account information (name and addresses)
- language toggling (default Arabic)


---

### Tech Stack
React
React Native
Redux
Firebase
NodeJS

#### APIs used
Algolia Search
Google Places
Messagebird
Firebase
- Firestore
- Storage
- Authentication
- Cloud Functions
- Push Notifications

#### Core Packages
Lodash
qs
Moment.js
React Router
Redux Thunk
React Native Img Cache

#### Permissions Required
Push Notifications
Current Location

---

### Data Structuring
** if you change this, make sure to update across firestore + cloud fx **

#### Seller
id
type
name
phone
override_eta
logo_url
is_public
disabled
\_geoloc (coordinate)
max_radius (delivery radius)
num_users (active users)
delivery_fee (default none -- apply if exists)
min_order (minimum price on the order)
\_tags: 'online'
objectID

#### Item
upc
title_arab
title_engl
image_url
increment (default 1, e.g. 100 in 100g)
unit (default null, e.g. 'g' in 100g)
category (e.g. 'pantry', 'breakfast')
subcategory (string)
brand (string)
alt_identifiers (array of other types of barcodes)
tags
date_created

required by store:
price
\_geo_loc
is_online

optional:
date_added
promotion_price
cost (unit cost by supplier)
priority (numeric, for influencing its search rank)
customizations (array of item customizations)

customer sets within order:
quantity
is_forced (means the associated seller MUST fulfill this item)

deprecated:
type (string, 'reward' vs 'standard')
points (float, if it can be purchased for with points)
image_source (now image_url)
category_t (now subcategory)

#### Order
customer (object)
seller (object)
items_array (array of item objects)
address (object)
notes
origin (any info regarding the device it came from, 'ANDROID' vs 'IOS')
coupon
payment (default cash (0), later enable credit card (2) and digital wallet (3))
print_requests (array of times the receipt was printed)
timestamp
status (see table below)

deprecated:
used_upcs

order statuses:
0 = order sent to store
50 = store saw order
100 = out for delivery
200 = successful completion
300 = cancelled by customer
400 = cancelled by store

#### Customer
name
phone
addresses (array of objects)
pushToken (for sending their phone push notifications)

#### Coupon
amount
minimum
type
store_limitation (null for all stores; if provided array, can only be applied for those stores)
max_uses (null for infinite)
num_uses
expiration (timestamp)
collection applied/{userID}: {timestamp: x}

---

### Code Formatting Guidelines

rely on underscore over camelcase for variable names (items_array > itemsArray)

instantiate all variables at the top of its parent function

refactor all text from a view to the top of the page
  (for easier formatting & multi-language support later on)

block comment explanations atop every file and function

import order hierarchy (for page uniformity):
  Lodash
	React
  React Native
  React Redux
  React Router Flux
  Firebase
  Algolia
  Qs
	any essential modules
	3ayez template components
  3ayez helper functions
	program actions
	any images, graphics, and sounds

within the class:
	top: view logic functions
	bottom: rendering views + UI components

all program logic contained within corresponding Redux action files
all program state variables stored within corresponding reducer

---

### Screenshots

![preview](http://3ayez.com/3ayez_april2018.png)

---

### For Version 3.0 (May)
allow customers to search and order items across available stores
deploy our routing algorithm for assigning stores to orders
