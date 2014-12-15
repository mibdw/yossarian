# Yossarian

*Where are the Snowdens of yesteryear?*

**Yossarian** is a web application, built to support intercompany communication and documentation. At this moment it supports the following functions:

- **Knowledge base**: A wiki-like document system. Here you can save static information. All documents support (*Github-flavored*) Markdown. A quicksearch box let's you find documents by title.
- **Calendar**: A place to save and view your events. You can also view a list of upcoming events. All events can be filtered by category.
- **Projects**: An overview for company projects. See and filter your projects by category or status in a list or calendar view. Each project has participants and tasks. A project detail can viewed as a description or timeline. All projects support (*Github-flavored*) Markdown.
- **Dashboard**: On the dashboard you can view changes made to the entire application, upcoming events and memos (simple announcements).

The to-do list for **Yossarian**:

- **Notifications**: Users should get notifications when documents/projects/events they are involved with get created, updated or removed.
- **Contacts**: A new menu-option that should serve as an address book. Each entry should also support a changelog-like message system for documentation.
- **User rights structure**: Right now everybody can do everything, not sure if that should stay this way.
- **File uploads**: It would be cool to attach files to projects or documents, to share with the participants.
- **Messages**: Not sure about this, but maybe it would be handy to be able to send messages through Yossarian. To one person or multiple people.
- **Websockets**: For that sweet realtime interactino.

**Yossarian** was built with and made possible by the following technologies:
[Node JS](http://nodejs.org/), [MongoDB](http://www.mongodb.org/), [Express JS](http://expressjs.com/), [Angular](https://angularjs.org/), [Moment JS](http://momentjs.com/), [Fullcalendar](http://fullcalendar.io/), [Passport JS](http://passportjs.org/), [Mongoose](http://mongoosejs.com/)