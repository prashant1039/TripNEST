# TripNEST 🌍

TripNEST is a full-stack travel web application that allows users to explore, create, and review travel listings. Users can sign up, log in, post destinations, upload images, and share reviews.

## 🚀 Features

* User authentication (Signup/Login/Logout)
* Create, edit, and delete travel listings
* Upload images for listings
* Add and manage reviews
* Interactive maps integration
* Flash messages and error handling
* Responsive UI

## 🛠️ Tech Stack

* **Frontend:** HTML, CSS, JavaScript, EJS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** Passport.js
* **Cloud Storage:** Cloudinary
* **Maps:** Mapbox
* **Other Tools:** Git, GitHub

## 📂 Project Structure

```
TripNEST/
│
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── utils/
├── init/
├── app.js
├── package.json
└── README.md
```

## ⚙️ Installation

1. Clone the repository:

```
git clone https://github.com/your-username/TripNEST.git
```

2. Navigate to the project folder:

```
cd TripNEST
```

3. Install dependencies:

```
npm install
```

4. Create a `.env` file and add your environment variables:

```
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_api_key
CLOUD_API_SECRET=your_api_secret
DB_URL=your_mongodb_url
MAP_TOKEN=your_mapbox_token
```

5. Start the server:

```
npm start
```

6. Open in browser:

```
http://localhost:8080
```

## 🔒 Environment Variables

Make sure your `.env` file is **not uploaded to GitHub**. It should contain:

* MongoDB connection string
* Cloudinary API keys
* Mapbox token
* Session secret

## 🤝 Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests.

## 📜 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Prashant Singh**

---

⭐ If you like this project, consider giving it a star on GitHub!
